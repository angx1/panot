import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import countries from "world-countries";
import { useCountry } from "@/components/providers/CountryProvider";

interface Country {
  cca2: string;
  name: { common: string };
  callingCode: string;
  flag: string;
}

export default function PickCountryCode() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSelectedCountry } = useCountry();
  const inputRef = useRef<TextInput>(null);

  const availableCountries = useMemo(() => {
    try {
      const filteredCountries = countries
        .filter((country: any) => {
          return country.idd?.root && country.name && country.flag;
        })
        .map((country: any) => {
          let callingCode = "";
          if (country.idd?.root) {
            const root = country.idd.root;
            const suffixes = country.idd.suffixes || [];

            if (suffixes.length > 0) {
              callingCode = root + suffixes[0];
            } else {
              callingCode = root;
            }
          }

          return {
            cca2: country.cca2,
            name: country.name,
            callingCode: callingCode,
            flag: country.flag,
          };
        })
        .filter(
          (country) => country.callingCode && country.callingCode.length > 0
        )
        .sort((a, b) => a.name.common.localeCompare(b.name.common));

      return filteredCountries;
    } catch (error) {
      console.error("Error loading countries:", error);
      return [];
    }
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return availableCountries;

    const query = searchQuery.toLowerCase();
    return availableCountries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query) ||
        country.callingCode.includes(query)
    );
  }, [availableCountries, searchQuery]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    router.back();
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 active:bg-gray-50"
      onPress={() => handleSelectCountry(item)}
    >
      <Text className="text-2xl mr-4">{item.flag}</Text>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 mb-1">
          {item.name.common}
        </Text>
        <Text className="text-sm text-gray-500">{item.callingCode}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View className="p-6 pb-2 bg-white z-10">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                ref={inputRef}
                className="flex-1 ml-3 text-gray-900 h-8 justify-center items-center"
                placeholder="Search country or code..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="done"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="p-1 rounded-full active:bg-gray-200"
                >
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.cca2}
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 0 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20 px-6">
                <Text className="text-gray-500 text-lg font-medium mb-2 text-center">
                  No countries found
                </Text>
                <Text className="text-gray-400 text-sm text-center">
                  Try adjusting your search terms
                </Text>
              </View>
            }
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={<View style={{ height: 0 }} />}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
