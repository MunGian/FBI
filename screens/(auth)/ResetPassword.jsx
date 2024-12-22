import React from 'react';
import { View, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormCustom from '../../components/FormCustom';
import ButtonCustom from '../../components/ButtonCustom';
import { supabase } from '../../services/supabase';

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [showNewPasswordInput, setShowNewPasswordInput] = React.useState(false);

  const verifyAndShowReset = async () => {
    if (!email || !username) {
      Alert.alert("Input Error", "Please enter both your email and username.");
      return;
    }
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('email, username')
        .eq('email', email)
        .eq('username', username)
        .single();

      if (error || !data) {
        Alert.alert("Input Error", "Email does not match your username. Please try again.");
      } else {
        setShowNewPasswordInput(true);
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async () => {

    const userPassword = await supabase
      .from('users')
      .select('password')
      .eq('email', email)
      .single();

      console.log(userPassword.data.password);
  
      const currentPassword = userPassword.data.password; // Plain-text password from the database
      console.log(currentPassword);

    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: currentPassword,
    })
    if (error) {
      Alert.alert("Error", "There was an issue with fetching.");
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Input Error", "Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Input Error", "Passwords do not match. Please try again.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        password: newPassword,
      });

      const { data, updateError } = await supabase
      .from('users')
      .update({
          password: newPassword,
        })
      .eq('email', email)
      if (updateError) {throw updateError;}

      if (!error) {
        Alert.alert("Success", "Password updated successfully!");
        navigation.navigate('SignIn'); // Redirect to sign-in after success
      } else {
        Alert.alert("Error", "There was an issue updating your password.");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <View className="justify-center w-full min-h-[90vh] px-4 my-6">
        <Text className="text-2xl text-white mt-7 font-semibold">
          Reset your password
        </Text>

        <FormCustom
          title="Email"
          value={email}
          handleChangeText={(text) => setEmail(text)}
          otherStyles="mt-6"
          keyboardType="email-address"
          placeholder="Enter your email"
        />

        <FormCustom
          title="Username"
          value={username}
          handleChangeText={(text) => setUsername(text)}
          otherStyles="mt-6"
          placeholder="Enter your username"
        />

        {/* Conditionally Render Password and Confirm Password Inputs */}
        {showNewPasswordInput && (
          <>
            <FormCustom
              title="New Password"
              value={newPassword}
              handleChangeText={(text) => setNewPassword(text)}
              otherStyles="mt-6"
              placeholder="Enter new password"
              secureTextEntry
            />
            <FormCustom
              title="Confirm New Password"
              value={confirmPassword}
              handleChangeText={(text) => setConfirmPassword(text)}
              otherStyles="mt-6"
              placeholder="Confirm new password"
              secureTextEntry
            />
          </>
        )}

        <ButtonCustom
          title={submitting ? "Processing..." : showNewPasswordInput ? "Reset Password" : "Verify"}
          handlePress={showNewPasswordInput ? resetPassword : verifyAndShowReset}
          containerStyles="mt-7"
          isLoading={submitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
