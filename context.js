import React, { useContext } from "react";

// Context는 공유하기 원하는 모든 것을 넣을 수 있는 공간, 일종의 상자
export const DBContext = React.createContext();

export const useDB = () => {
  return useContext(DBContext);
};
