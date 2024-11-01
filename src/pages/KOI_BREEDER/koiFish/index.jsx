import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Image,
  Radio,
  Modal,
  Switch,
  Tag,
  Tooltip,
  Col,
  Row,
  InputNumber,
} from "antd";
import DashboardTemplate from "../../../components/dashboard-manage-template";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import formatToVND from "../../../utils/currency";
import { useForm } from "antd/es/form/Form";
function ManageKoiFish() {
  const title = "KoiFish";
  const [varieties, setVarieties] = useState([]);
  const [health, setHealth] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [render, setRender] = useState(false);
  const [formHealth] = useForm();
  const [form] = useForm();
  const [formViewDetails] = useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontWeight: "bold", color: "#1890ff" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Size (cm)",
      dataIndex: "sizeCm",
      key: "sizeCm",
      render: (size) => (
        <Tooltip title={`Size: ${size} cm`}>
          <span>{size} cm</span>
        </Tooltip>
      ),
    },
    {
      title: "Weight (kg)",
      dataIndex: "weightKg",
      key: "weightKg",
      render: (weight) => (
        <Tooltip title={`Weight: ${weight} kg`}>
          <span>{weight} kg</span>
        </Tooltip>
      ),
    },
    {
      title: "Estimated Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (value) => (
        <Tooltip title={`Estimated value: ${formatToVND(value)}`}>
          <span>{formatToVND(value)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url) => (
        <Tooltip title="View Image">
          <Image
            width={100} // Adjust width for a smaller display
            src={image_url}
            style={{ borderRadius: "5px", objectFit: "cover" }} // Maintain aspect ratio
            preview={false} // Prevent default Ant Design preview
          />
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "koiStatus",
      key: "koiStatus",
      render: (status) => {
        let color;
        switch (status) {
          case "AVAILABLE":
            color = "green";
            break;
          case "PENDING":
            color = "yellow";
            break;
          case "PENDING_AUCTION":
            color = "orange";
            break;
          case "SOLD":
            color = "blue";
            break;
          case "SELLING":
            color = "purple";
            break;
          default:
            color = "red";
        }
        return (
          <Tooltip title={status}>
            <Tag color={color} style={{ cursor: "pointer" }}>
              {status}
            </Tag>
          </Tooltip>
        );
      },
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
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name!" }]}
          style={{ height: "90px" }} // Set height
        >
          <Input placeholder="Enter koi name" />
        </Form.Item>

        <Form.Item
          label="Sex"
          name="sex"
          rules={[{ required: true, message: "Please select the sex!" }]}
          style={{ height: "90px" }} // Set height
        >
          <Select placeholder="Select sex">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Size (cm)"
          name="sizeCm"
          rules={[{ required: true, message: "Please enter the size!" }]}
          style={{ height: "90px" }} // Set height
        >
          <Input type="number" placeholder="Enter size in cm" />
        </Form.Item>

        <Form.Item
          label="Weight (kg)"
          name="weightKg"
          rules={[{ required: true, message: "Please enter the weight!" }]}
          style={{ height: "90px" }} // Set height
        >
          <Input type="number" placeholder="Enter weight in kg" />
        </Form.Item>

        <Form.Item
          label="Estimated Value"
          name="estimatedValue"
          rules={[{ required: true, message: "Please enter the estimated value!" }]}
          style={{ height: "90px" }} // Set height
        >
          <InputNumber min={0} addonBefore="+" addonAfter="đ" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          style={{ height: "90px" }} // Set height
        >
          <Input.TextArea placeholder="Enter a description" />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Variety"
          name="varietiesID"
          rules={[{ required: true, message: "Please select the variety!" }]}
          style={{ height: "90px" }} // Set height
        >
          <Select mode="multiple" placeholder="Select varieties">
            {varieties.map((variety) => (
              <Select.Option key={variety.id} value={variety.id}>
                {variety.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="bornIn"
          rules={[{ required: true, message: "Please select the date of birth!" }]}
          style={{ height: "90px" }} // Set height
        >
          <DatePicker placeholder="Select date of birth" />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="image_url"
          rules={[
            {
              required: true,
              message: "Please upload koi image",
            },
          ]}
          style={{ height: "90px" }} // Set height
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Video URL"
          name="video_url"
          style={{ height: "90px" }} // Set height
        >
          <Input placeholder="Enter video URL" />
        </Form.Item>
      </Col>
    </Row>
  );
  const formViewDetailsItems = (
    <Row gutter={16}>
      <Col span={12}>
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

        {/* Estimated Value */}
        <Form.Item label="Estimated Value" name="estimatedValue">
          <Input disabled type="number" placeholder="Enter estimated value" />
        </Form.Item>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <Input.TextArea disabled placeholder="Enter a description" />
        </Form.Item>
      </Col>

      <Col span={12}>
        {/* Variety */}
        <Form.Item label="Variety" name="varieties" disabled>
          <Select disabled mode="multiple" placeholder="Select varieties">
            {varieties.map((variety) => (
              <Select.Option key={variety.id} value={variety.id}>
                {variety.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Born in */}
        <Form.Item label="Date of Birth" name="bornIn">
          <DatePicker disabled placeholder="Select date of birth" />
        </Form.Item>

        {/* Video URL */}
        <Form.Item label="Video URL" name="video_url">
          <Input disabled placeholder="Enter video URL" />
        </Form.Item>
      </Col>
    </Row>
  );
  return (
    <div style={{ margin: "100px auto" }}>
      <DashboardTemplate
        isRerender={render}
        apiURI="koiFish/koiBreeder/pagination"
        apiUriPOST={"koiFish"}
        apiUriPUT={"koiFish"}
        apiUriDelete={"koiFish"}
        formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"bornIn"}
        keyField={"koi_id"}
        formViewDetailsItem={formViewDetailsItems}
        isBasicCRUD={true}
        isIncludeImage={true}
        form={form}
        formViewDetails={formViewDetails}
        isCreateNew={true}
        paginationTarget={"koiFishResponseList"}
      />
    </div>
  );
}

export default ManageKoiFish;
