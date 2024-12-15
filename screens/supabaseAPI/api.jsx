import { supabase } from '../../services/supabase'; // Assuming supabase is initialized here
import { debounce } from '../../services/util';

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

export const fetchFoodList = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table to get the list of food items donated by the current login user
    const { data: donatedFoodItems, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .eq('donoremail', user.email);

    if (donationError) throw donationError;

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedFoodItems.map(item => item.foodid);
    const formattedIds = `(${donatedFoodIds.join(',')})`;
    // console.log('Donated Food Items:', formattedIds);

    // Fetch food items where donoremail is not the current user's email
    const { data: foodItems, error: queryError } = await supabase
    .from('fooditem')
    .select('*')
    .not('foodid', 'in', formattedIds)
    // .limit(20);  // Limit to 20 items

    if (queryError) throw queryError;

    return foodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
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
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table to get the list of food items donated by the current login user
    const { data: donatedFoodItems, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .eq('donoremail', user.email);

    if (donationError) throw donationError;

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedFoodItems.map(item => item.foodid);
    const formattedIds = `(${donatedFoodIds.join(',')})`;

    // Build the query to filter food items based on category and district
    let query = supabase
      .from('fooditem')
      .select('*')
      .not('foodid', 'in', formattedIds);

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

    return foodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

export const fetchFilteredRequestList = async (category, district) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the request table to get the list of request items by the current login user
    const { data: requestFoodItems, error: requestError } = await supabase
      .from('request')
      .select('requestid')
      .eq('requestemail', user.email);

    if (requestError) throw requestError;

    // Extract the list of request IDs
    const donatedFoodIds = requestFoodItems.map(item => item.foodid);
    const formattedIds = `(${donatedFoodIds.join(',')})`;

    // Build the query to filter food items based on category and district
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
      .not('requestid', 'in', formattedIds);

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
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the donation table to get the list of food items donated by the current login user
    const { data: donatedFoodItems, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .eq('donoremail', user.email);

    if (donationError) throw donationError;

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedFoodItems.map(item => item.foodid);
    const formattedIds = `(${donatedFoodIds.join(',')})`;

    // Build the query to filter food items based on search query
    let query = supabase
      .from('fooditem')
      .select('*')
      .not('foodid', 'in', formattedIds);

    // Apply search filter if there's a query
    if (searchQuery) {
      query = query.ilike('foodname', `%${searchQuery}%`); // Case-insensitive search for food name
    }

    const { data: foodItems, error: queryError } = await query;

    if (queryError) throw queryError;

    return foodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};

export const fetchSearchedRequestList = async (searchQuery = '') => {
  try {
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user?.email) throw new Error("No authenticated user found");

    // Query the request table to get the list of food items donated by the current login user
    const { data: requestFoodItems, error: requestError } = await supabase
      .from('request')
      .select('requestid')
      .eq('requestemail', user.email);

    if (requestError) throw requestError;

    // Extract the list of donated food IDs
    const donatedFoodIds = requestFoodItems.map(item => item.foodid);
    const formattedIds = `(${donatedFoodIds.join(',')})`;

    // Build the query to filter food items based on search query
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
      .not('requestid', 'in', formattedIds);

    // Apply search filter if there's a query
    if (searchQuery) {
      query = query.ilike('requestname', `%${searchQuery}%`); // Case-insensitive search for food name
    }

    const { data: requestItems, error: queryError } = await query;

    if (queryError) throw queryError;

    return requestItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
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
    .eq('requestemail', user.email);

    if (requestError) throw requestError;

    if (!requestFoodItems || requestFoodItems.length === 0) {
      console.log("No donations found for the user.");
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
    const { data: donatedFoodItems, error: donationError } = await supabase
      .from('donation')
      .select('foodid')
      .eq('donoremail', user.email);

    if (donationError) throw donationError;

    if (!donatedFoodItems || donatedFoodItems.length === 0) {
      console.log("No donations found for the user.");
      return [];
    }

    // Extract the list of donated food IDs
    const donatedFoodIds = donatedFoodItems.map((item) => item.foodid);

    // Fetch food items from the 'fooditem' table matching the donated food IDs
    const { data: foodItems, error: foodError } = await supabase
      .from('fooditem')
      .select('*')
      .in('foodid', donatedFoodIds)
      .limit(20); // Limit to 20 items

    if (foodError) throw foodError;

    return foodItems;
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    return [];
  }
};