import React from "react";
import GnuRadioBezier from "./GnuRadioBezier";

const BezierAutoTest = () => {
  return (
    <div className="fixed">
      <GnuRadioBezier
        start={{ x: 40, y: 100 }}
        end={{ x: 360, y: 200 }}
      />
      </div>
  );
};

export default BezierAutoTest;
