import Realm from "realm";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  async function startLoading() {
    try {
      // realm 데이터베이스 접근을 모든 스크린과 공유해야 함
      const realm = await Realm.open({
        path: "diaryDb",
        schema: [FeelingSchema],
      });
      // console.log("realm", realm); // 연결 여부 확인 위해 사용
      // setRealm(realm);
    } catch (e) {
      console.log(e);
    } finally {
      setAppIsReady(true);
    }
  }

  useEffect(() => {
    startLoading();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </View>
  );
}
