import { supabase } from '../../services/supabase'; 

export const fetchUserLastName = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'users' table to get the last name using the user's email
    const { data: queryData, error: queryError } = await supabase
      .from('users')
      .select('lastname')
      .eq('email', user.email)
      .single();

    if (queryError) throw queryError;

    return queryData?.lastname || '';
  } catch (error) {
    console.error("Error fetching last name:", error.message);
    return '';
  }
};

export const fetchUserDetails = async () => {
  try {
    // Step 1: Fetch the authenticated user
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) {
      throw new Error("No authenticated user found");
    }

    // Step 2: Query 'users' table to fetch user details based on email
    const { data: userDetails, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (queryError) {
      console.error("Error querying users table:", queryError.message);
      throw queryError;
    }

    // Step 3: Return the fetched user details
    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error.message, error);
    return null; // Return null instead of an empty string for better handling
  }
};


export const fetchFoodList = async () => {
  try {
    // Get authenticated user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table for items not belonging to the current user and with status Pending
    const { data: donations, error: donationError } = await supabase
      .from('donation')
      .select('foodid') 
      .eq('status', 'Pending')
      .neq('donoremail', user.email); // Exclude items belonging to the current user

    if (donationError) throw donationError;

    if (!donations || donations.length === 0) {
      return [];
    }

    // Extract food IDs from the donations
    const foodIds = donations.map((donation) => donation.foodid);

    // Get today's date in the correct format
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Query the fooditem table for detailed information about the food items
    const { data: foodItems, error: foodItemError } = await supabase
      .from('fooditem')
      .select('*')
      .in('foodid', foodIds) // Filter by the food IDs from the donation table
      .gte('expirydate', today); // Filter items with expirydate today or later

    if (foodItemError) throw foodItemError;

    if (!foodItems || foodItems.length === 0) {
      return [];
    }

    return foodItems;
  } catch (error) {
    console.error("Error fetching available food items:", error.message);
    return [];
  }
};



export const fetchRequestList = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the request table and join the users table to get additional user details
    const { data: requestFoodItems, error: requestError } = await supabase
      .from('request')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )
      `)
      .eq('status', 'Pending')
      .neq('requestemail', user.email); // Exclude requests from the logged-in user

    if (requestError) throw requestError;

    return requestFoodItems;
  } catch (error) {
    console.error("Error fetching request list:", error.message);
    return [];
  }
};

export const fetchFilteredFoodList = async (category, district) => {
  try {
    // Get authenticated user details
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table for items not belonging to the current user and with status Pending
    const { data: donations, error: donationError } = await supabase
      .from('donation')
      .select('foodid') 
      .eq('status', 'Pending')
      .neq('donoremail', user.email); // Exclude items belonging to the current user

    if (donationError) throw donationError;

    if (!donations || donations.length === 0) {
      // console.log("No available donations found.");
      return [];
    }

    // Extract food IDs from the donations
    const foodIds = donations.map((donation) => donation.foodid);

    // Get today's date in the correct format
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Query the fooditem table for detailed information about the food items
    let query =  supabase
      .from('fooditem')
      .select('*')
      .in('foodid', foodIds) // Filter by the food IDs from the donation table
      .gte('expirydate', today); // Filter items with expirydate today or later

    // Apply category filter if selected
    if (category) {
      query = query.eq('category', category);
    }

    // Apply district filter if selected
    if (district) {
      query = query.eq('district', district);
    }

    // Fetch food items with the applied filters
    const { data: foodItems, error: queryError } = await query;

    if (queryError) throw queryError;

    if (!foodItems || foodItems.length === 0) {
      // console.log("No matching food items found.");
      return [];
    }

    return foodItems;
  } catch (error) {
    console.error("Error fetching filtered food list:", error.message);
    return [];
  }
};


export const fetchFilteredRequestList = async (category, district) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.email) throw new Error("No authenticated user found");

    // Query the request table to get the list of request items not made by the current user and with 'Pending' status
    const { data: requestHistory, error: requestError } = await supabase
      .from('request')
      .select('requestid')
      .neq('requestemail', user.email)
      .eq('status', 'Pending'); // Only Pending requests

    if (requestError) throw requestError;

    // Extract the list of request IDs
    const requestIds = requestHistory.map(item => item.requestid);

    // Build the query to filter request items based on the search query
    let query = supabase
      .from('request')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )
      `)
      .in('requestid', requestIds); // Include only items that are "Pending"

    // Apply category filter if selected
    if (category) {
      query = query.eq('requestcategory', category);
    }

    // Apply district filter if selected
    if (district) {
      query = query.eq('requestdistrict', district);
    }

    // Fetch food items with the applied filters
    const { data: requestItems, error: queryError } = await query;

    if (queryError) throw queryError;

    return requestItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

export const fetchSearchedFoodList = async (searchQuery = '') => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table to get the list of food items not donated by the current user and with 'Pending' status
    const { data: donatedHistory, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .neq('donoremail', user.email)
      .eq('status', 'Pending'); 

    if (donationError) throw donationError;

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedHistory.map(item => item.foodid);

    // Get today's date in the correct format
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Build the query to filter food items based on the search query
    let query = supabase
      .from('fooditem')
      .select('*')
      .in('foodid', donatedFoodIds) // Include only items that are "Pending" in donation
      .gte('expirydate', today); // Filter items with expirydate today or later
    
      // Apply search filter if there's a query
    if (searchQuery) {
      query = query.ilike('foodname', `%${searchQuery}%`); // Case-insensitive search for food name
    }

    const { data: foodItems, error: queryError } = await query;

    if (queryError) throw queryError;

    if (!foodItems || foodItems.length === 0) {
      // console.log("No matching food items found.");
      return [];
    }

    return foodItems;
  } catch (error) {
    console.error("Error fetching searched food list:", error.message);
    return [];
  }
};
    
export const fetchSearchedRequestList = async (searchQuery = '') => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user?.email) throw new Error("No authenticated user found");

    // Query the request table to get the list of request items not made by the current user and with 'Pending' status
    const { data: requestHistory, error: requestError } = await supabase
      .from('request')
      .select('requestid')
      .neq('requestemail', user.email)
      .eq('status', 'Pending'); // Only Pending requests

    if (requestError) throw requestError;

    // Extract the list of request IDs
    const requestIds = requestHistory.map(item => item.requestid);

    // Build the query to filter request items based on the search query
    let query = supabase
      .from('request')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )
      `)
      .in('requestid', requestIds); // Include only items that are "Pending"

    // Apply search filter if there's a query
    if (searchQuery) {
      query = query.ilike('requestname', `%${searchQuery}%`); // Case-insensitive search for request name
    }

    const { data: requestItems, error: queryError } = await query;

    if (queryError) throw queryError;

    if (!requestItems || requestItems.length === 0) {
      // console.log("No matching request items found.");
      return [];
    }

    return requestItems;
  } catch (error) {
    console.error("Error fetching searched request list:", error.message);
    return [];
  }
};


// in Create page
export const fetchRequestedFoodList = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table to get the list of food items donated by the current login user
    const { data: requestFoodItems, error: requestError } = await supabase
    .from('request')
    .select(`
      *,
      users (
        firstname,
        lastname,
        photo_url
      )
    `)
    .eq('status', 'Pending')
    .eq('requestemail', user.email)
    .order('requestdate', { ascending: false });

    if (requestError) throw requestError;

    if (!requestFoodItems || requestFoodItems.length === 0) {
      // console.log("No donations found for the user.");
      return [];
    }

    return requestFoodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

// in Create page
export const fetchDonatedFoodList = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'donation' table to get the list of food IDs donated by the user
    const { data: donatedHistory, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .eq('status', 'Pending') // Filter only 'Pending' donations
      .eq('donoremail', user.email);

    if (donationError) throw donationError;

    if (!donatedHistory || donatedHistory.length === 0) {
      // console.log("No donations found for the user.");
      return [];
    }

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedHistory.map((item) => item.foodid);

    // Fetch food items from the 'fooditem' table matching the donated food IDs
    const { data: foodItems, error: foodError } = await supabase
      .from('fooditem')
      .select('*')
      .in('foodid', donatedFoodIds)
      .order('expirydate', { ascending: false });

    if (foodError) throw foodError;

    return foodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

// in Create page
export const fetchMyArticleList = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'articles' table, sorting by 'created_at' in descending order
    const { data: articles, error: articlesError } = await supabase
      .from('article')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )`
      )
      .eq('email', user.email)
      .order('articledate', { ascending: false }); // Sort by 'created_at' descending

    if (articlesError) throw error;

    if (!articles || articles.length === 0) {
      // console.log("No articles found.");
      return [];
    }

    return articles;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

// in Create page
export const fetchMyEventList = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'event' table, sorting by 'created_at' in descending order
    const { data: events, error: eventsError } = await supabase
      .from('event')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )`
      )
      .eq('email', user.email)
      .order('eventdate', { ascending: false }); 

    if (eventsError) throw error;

    if (!events || events.length === 0) {
      // console.log("No articles found.");
      return [];
    }

    return events;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

// in explore page
export const fetchArticles = async () => {
  try {
    // Query the 'articles' table, sorting by 'created_at' in descending order
    const { data: articles, error: articlesError } = await supabase
      .from('article')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )`
      )
      .order('articledate', { ascending: false }); // Sort by 'created_at' descending

    if (articlesError) throw error;

    if (!articles || articles.length === 0) {
      // console.log("No articles found.");
      return [];
    }

    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    return [];
  }
};

// in Explore page
export const fetchEvents = async () => {
  try{
    // Get today's date in the correct format
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    // Query the 'events' table, sorting by 'created_at' in descending order
    const { data: events, error: eventsError } = await supabase
      .from('event')
      .select(`
        *,
        users (
          firstname,
          lastname,
          photo_url
        )`
      )
      .gte('eventdate', today) // Filter items with eventdate today or later
      .order('eventdate', { ascending: false }); // Sort by 'created_at' descending

    if (eventsError) throw error;

    if (!events || events.length === 0) {
      // console.log("No events found.");
      return [];
    }

    return events;
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return [];
  }
}

// in History page
export const fetchDonatedHistory = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'donation' table to get the list of food IDs donated by the user
    const { data: donatedHistory, error: donationError } = await supabase
      .from('receipt')
      .select(`
        *,
        fooditem (
          foodid,
          foodname,
          category,
          quantity,
          address,
          district,
          description,
          expirydate,
          foodphoto_url
        )
      `)
      .or(`donoremail.eq.${user.email},recipientemail.eq.${user.email}`);

    if (donationError) throw donationError;

    if (!donatedHistory || donatedHistory.length === 0) {
      // console.log("No donation history found for the user.");
      return [];
    }

    // Filter out records where the foreign key 'fooditem' is null or empty
    const filteredHistory = donatedHistory.filter(item => item.fooditem);

    if (filteredHistory.length === 0) {
      // console.log("No valid donation history found after filtering empty foreign keys.");
      return [];
    }

    return filteredHistory;
  } catch (error) {
    console.error("Error fetching donation history:", error.message);
    return [];
  }
};


// in History page
export const fetchRequestHistory = async () => {
  try {
    // Get authenticated user details
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the 'donation' table to get the list of food IDs donated by the user
    const { data: requestHistory, error: requestHistoryError } = await supabase
      .from('receipt')
      .select(`
        *,
        request (
          requestid,
          requestname,
          requestcategory,
          requestquantity,
          requestaddress,
          requestdistrict,
          requestdescription
        )
      `)
      .or(`donoremail.eq.${user.email},recipientemail.eq.${user.email}`);

    if (requestHistoryError) throw requestHistoryError;

    if (!requestHistory || requestHistory.length === 0) {
      console.log("No request history found for the user.");
      return [];
    }

    // Filter out records where the foreign key 'receipt' is null or empty
    const filteredHistory = requestHistory.filter(item => item.request);

    if (filteredHistory.length === 0) {
      // console.log("No valid request history found after filtering empty foreign keys.");
      return [];
    }

    return filteredHistory;
  } catch (error) {
    console.error("Error fetching request history:", error.message);
    return [];
  }
};

// in History page
export const updateDonorFeedback = async (id, email, feedback, rating) => {
  try {
    // Update the 'receipt' table with the feedback and rating
    const { data: feedbackDonor, error: feedbackDonorError } = await supabase
      .from('receipt')
      .update({
        donorstatus: 'Completed',
        donorfeedback: feedback,
        donorrating: rating,
      })
      .eq('donoremail', email)
      .eq('receiptid', id);

    if (feedbackDonorError) throw feedbackDonorError;

    console.log("Feedback updated successfully:", id, email, feedback, rating);
    return feedbackDonor; // Optionally return the updated data
  } catch (error) {
    console.error("Error updating donor feedback:", error.message);
    return []; // Return an empty array in case of error
  }
};

// in History page
export const updateRecipientFeedback = async (id, email, feedback, rating) => {
  try {
    // Update the 'receipt' table with the feedback and rating
    const { data: feedbackRecipient, error: feedbackRecipientError } = await supabase
      .from('receipt')
      .update({
        recipientstatus: 'Completed',
        recipientfeedback: feedback,
        recipientrating: rating,
      })
      .eq('recipientemail', email)
      .eq('receiptid', id);

    if (feedbackRecipientError) throw feedbackRecipientError;

    console.log("Feedback updated successfully:", id, email, feedback, rating);
    return feedbackRecipient; // Optionally return the updated data
  } catch (error) {
    console.error("Error updating recipient feedback:", error.message);
    return []; // Return an empty array in case of error
  }
};
