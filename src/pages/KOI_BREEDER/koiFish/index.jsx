import React from "react";
import { Button, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import DashboardTemplate from "../../../components/dashboard-manage-template";

function ManageKoiFish() {
  const title = "KoiFish";
  const columns = [
    // {
    //   title: "koi_id",
    //   dataIndex: "koi_id",
    //   key: "koi_id",
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Size_cm",
      dataIndex: "sizeCm",
      key: "sizeCm",
    },
    {
      title: "Weight_kg",
      dataIndex: "weightKg",
      key: "weightKg",
    },
    {
      title: "Variety",
      dataIndex: "varietiesID",
      key: "variety",
    },
    {
      title: "Estimated Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
    },
    {
      title: "Born in",
      dataIndex: "bornIn",
      key: "bornIn",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "koiStatus",
      key: "koiStatus",
    },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
    },
    {
      title: "Video",
      dataIndex: "video_url",
      key: "video_url",
    },
  ];
  const formItems = (
    <>
      <Form.Item label="Enter name" name={"name"}>
        <Input />
      </Form.Item>
      <Form.Item label="Enter description" name={"description"}>
        <TextArea />
      </Form.Item>
    </>
  );
  return (
    <div>
      <DashboardTemplate apiURI="koiFish" formItems={formItems} title={title} columns={columns} />
    </div>
  );
}

export default ManageKoiFish;
