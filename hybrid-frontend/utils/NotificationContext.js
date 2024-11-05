// NotificationContext.js

import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
  };

  const removeNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationDisplay notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationDisplay = ({ notifications, removeNotification }) => {
  return (
    <View style={styles.notificationContainer}>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
          <TouchableOpacity onPress={() => removeNotification(index)}>
            <Text style={styles.closeButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 1000,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationText: {
    color: '#333',
  },
  closeButton: {
    color: '#FF0000',
  },
});
