import React from "react";
import SalesHistoryHero from "../components/saleshistory/SalesHistioryHero";
import TabHistory from "./../components/saleshistory/TabHistory";

const SalesHistory = () => {
  return (
    <div className="App relative scroll-smooth">
      <SalesHistoryHero />|
      <TabHistory />
    </div>
  );
};

export default SalesHistory;
