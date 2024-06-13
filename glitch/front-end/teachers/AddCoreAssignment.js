import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import axiosInstance from '../axiosInstance';
import { AuthContext } from '../AuthProvider';