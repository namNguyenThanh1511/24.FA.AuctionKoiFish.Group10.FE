import React from "react";
import { Button, Result } from "antd";
const PaymentNotification = () => {
  <Result
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    extra={[
      <Button type="primary" key="console">
        Go Wallet
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  />
};

export default PaymentNotification;
