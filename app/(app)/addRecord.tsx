import * as userApi from "@/api/users.api";
import { Category } from "@/api/users.types";
import { useAuth } from "@/providers/AuthProvider";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

function AddRecordPage() {
  const { profile } = useAuth();
  const [categories, setCategories] = React.useState<Category[]>([]);
  useEffect(() => {
    const fetchUserCategories = async () => {
      if (!profile) return;
      try {
        const result = await userApi.getUserCategories(profile.userId);
        if (!result.success) {
          console.error("Error fetching user categories:", result.error);
          return;
        }
        setCategories(result.data);
      } catch (error) {
        console.error("Error fetching user categories:", error);
      }
    };
    fetchUserCategories();
  }, [profile]);

  return (
    <View>
      {categories.length > 0 &&
        categories.map((category) => (
          <Text key={category.id}>
            {category.name} - {category.type}
          </Text>
        ))}
    </View>
  );
}

export default AddRecordPage;
