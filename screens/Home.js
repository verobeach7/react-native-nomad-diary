import React, { useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { useDB } from "../context";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

// android에서 Layout Animation을 사용하기 위해서는 아래 코딩이 필요함
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0px 50px;
  padding-top: 100px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  font-weight: 500;
  width: 100%;
  margin-bottom: 20px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  elevation: 5;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;

const Message = styled.Text`
  font-size: 18px;
`;

const Seperator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  // !!! useContext !!!
  const realm = useDB();
  // 새로운 item이 추가되거나 item이 수정, 삭제되었을 때 이를 반영하지 못함 -> useEffect를 사용해 해결
  // const [feelings, setFeelings] = useState(realm.objects("Feeling"));
  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const feelings = realm.objects("Feeling");
    // !!! Event Listener !!!
    feelings.addListener((feelings, changes) => {
      // console.log(changes); // {"deletions": [], "insertions": [], "newModifications": [], "oldModifications": []}
      // !!! Layout Animation !!!
      // State에 어떤 변화가 생겼든지 animation하고 싶어라고 말 하는 것
      // State 변화를 주기 전에 아래 코드를 사용하여 애니메이션이 적용되게 함
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      LayoutAnimation.linear();
      setFeelings(feelings.sorted("_id", true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPress = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      // console.log(feeling);
      realm.delete(feeling);
    });
  };

  return (
    <View>
      <Title>My journal</Title>
      <BannerAd unitId={adUnitId} size={BannerAdSize.FULL_BANNER} />
      <FlatList
        style={{ marginVertical: 50, width: "100%" }}
        data={feelings}
        keyExtractor={(feeling) => feeling._id + ""}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={Seperator}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </View>
  );
};
export default Home;
