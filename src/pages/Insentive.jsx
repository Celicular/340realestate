import React from "react";
import InsentiveHero from "./../components/incentive/InsentiveHero.";
import ConnectWithUs from "./../components/incentive/ConnectWithUs";
import EDCIncentives from "./../components/incentive/EDCIncentives";

const Insentive = () => {
  return (
    <div className="App relative scroll-smooth">
      <InsentiveHero />|
      <ConnectWithUs />
      <EDCIncentives />
    </div>
  );
};

export default Insentive;
