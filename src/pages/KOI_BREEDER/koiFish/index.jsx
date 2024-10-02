import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, DatePicker, Upload, message, Image } from "antd";
import DashboardTemplate from "../../../components/dashboard-manage-template";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import formatToVND from "../../../utils/currency";
function ManageKoiFish() {
  const title = "KoiFish";
  const [varieties, setVarieties] = useState([]);
  const columns = [
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
      title: "Estimated Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value) => <span>{formatToVND(value)}</span>,
    },

    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url) => (
        <>
          <Image width={200} src={image_url} />
        </>
      ),
    },
  ];

  const fetchVarieties = async () => {
    try {
      const response = await api.get("variety/all");
      setVarieties(response.data);
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchVarieties();
  }, []);

  console.log(varieties);

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const formItems = (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the name!" }]}
      >
        <Input placeholder="Enter koi name" />
      </Form.Item>

      {/* Sex */}
      <Form.Item
        label="Sex"
        name="sex"
        rules={[{ required: true, message: "Please select the sex!" }]}
      >
        <Select placeholder="Select sex">
          <Select.Option value="MALE">Male</Select.Option>
          <Select.Option value="FEMALE">Female</Select.Option>
        </Select>
      </Form.Item>

      {/* Size in cm */}
      <Form.Item
        label="Size (cm)"
        name="sizeCm"
        rules={[{ required: true, message: "Please enter the size!" }]}
      >
        <Input type="number" placeholder="Enter size in cm" />
      </Form.Item>

      {/* Weight in kg */}
      <Form.Item
        label="Weight (kg)"
        name="weightKg"
        rules={[{ required: true, message: "Please enter the weight!" }]}
      >
        <Input type="number" placeholder="Enter weight in kg" />
      </Form.Item>

      {/* Variety */}
      <Form.Item
        label="Variety"
        name="varietiesID"
        rules={[{ required: true, message: "Please select the variety!" }]}
      >
        <Select mode="multiple" placeholder="Select varieties">
          {varieties.map((variety) => (
            <Select.Option key={variety.id} value={variety.id}>
              {variety.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Estimated Value */}
      <Form.Item
        label="Estimated Value"
        name="estimatedValue"
        rules={[{ required: true, message: "Please enter the estimated value!" }]}
      >
        <Input type="number" placeholder="Enter estimated value" />
      </Form.Item>

      {/* Born in */}
      <Form.Item
        label="Date of Birth"
        name="bornIn"
        rules={[{ required: true, message: "Please select the date of birth!" }]}
      >
        <DatePicker placeholder="Select date of birth" />
      </Form.Item>

      {/* Description */}
      <Form.Item label="Description" name="description">
        <Input.TextArea placeholder="Enter a description" />
      </Form.Item>

      {/* Image URL */}
      <Form.Item
        label="Image URL"
        name="image_url"
        rules={[
          {
            required: true,
            message: "Please upload koi image",
          },
        ]}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      {/* Video URL */}
      <Form.Item label="Video URL" name="video_url">
        <Input placeholder="Enter video URL" />
      </Form.Item>
    </>
  );
  const formViewDetailsItems = (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the name!" }]}
      >
        <Input disabled placeholder="Enter koi name" />
      </Form.Item>

      {/* Sex */}
      <Form.Item
        label="Sex"
        name="sex"
        rules={[{ required: true, message: "Please select the sex!" }]}
      >
        <Select disabled placeholder="Select sex">
          <Select.Option value="MALE">Male</Select.Option>
          <Select.Option value="FEMALE">Female</Select.Option>
        </Select>
      </Form.Item>

      {/* Size in cm */}
      <Form.Item label="Size (cm)" name="sizeCm">
        <Input disabled type="number" placeholder="Enter size in cm" />
      </Form.Item>

      {/* Weight in kg */}
      <Form.Item label="Weight (kg)" name="weightKg">
        <Input disabled type="number" placeholder="Enter weight in kg" />
      </Form.Item>

      {/* Variety */}
      <Form.Item label="Variety" name="varietiesID" disabled>
        <Select disabled mode="multiple" placeholder="Select varieties">
          <Select.Option value={1}>Sowa</Select.Option>
          <Select.Option value={2}>Kohaku</Select.Option>
          <Select.Option value={3}>Origi</Select.Option>
        </Select>
      </Form.Item>

      {/* Estimated Value */}
      <Form.Item label="Estimated Value" name="estimatedValue">
        <Input disabled type="number" placeholder="Enter estimated value" />
      </Form.Item>

      {/* Born in */}
      <Form.Item label="Date of Birth" name="bornIn">
        <DatePicker disabled placeholder="Select date of birth" />
      </Form.Item>

      {/* Description */}
      <Form.Item label="Description" name="description">
        <Input.TextArea disabled placeholder="Enter a description" />
      </Form.Item>

      {/* Video URL */}
      <Form.Item label="Video URL" name="video_url">
        <Input disabled placeholder="Enter video URL" />
      </Form.Item>
    </>
  );
  return (
    <div>
      <DashboardTemplate
        apiURI="koiFish"
        formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"bornIn"}
        keyField={"koi_id"}
        formViewDetails={formViewDetailsItems}
      />
    </div>
  );
}

export default ManageKoiFish;
