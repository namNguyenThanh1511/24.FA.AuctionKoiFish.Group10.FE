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
  Slider,
} from "antd";
import DashboardTemplate from "../../../components/dashboard-manage-template";
import dayjs from "dayjs";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import formatToVND from "../../../utils/currency";
import { useForm } from "antd/es/form/Form";
import BasicFilter from "../../../components/basic-filter";
import Title from "antd/es/skeleton/Title";
import "./index.css";
function ManageKoiFish() {
  const title = "Koi Fish";
  const [varieties, setVarieties] = useState([]);
  const [health, setHealth] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [render, setRender] = useState(false);
  const [formHealth] = useForm();
  const [form] = useForm();
  const [formViewDetails] = useForm();
  const [filters, setFilters] = useState({
    status: null,
    sex: null,
    minSizeCm: null,
    maxSizeCm: null,
    minWeightKg: null,
    maxWeightKg: null,
    upperEstimatedValue: null,
    lowerEstimatedValue: null,
    varietiesName: null,
  });

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
      title: "Varieties",
      dataIndex: "varieties",
      key: "varieties",
      render: (varieties) => (
        <>
          {varieties.map((variety) => (
            <div key={variety.id}>{variety.name}</div>
          ))}
        </>
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
        const statusColors = {
          AVAILABLE: "green",
          PENDING: "yellow",
          PENDING_AUCTION: "orange",
          SELLING: "purple",
          DELIVER_REQUIRED: "red",
          DELIVERING_TO_BUYER: "teal",
          RETURNING: "brown",
          SOLD: "blue",
          UNAVAILABLE: "gray",
        };
        let color = statusColors[status];

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
          rules={[
            { required: true, message: "Please enter the name!" },
            { max: 100, message: "Name cannot exceed 100 characters!" },
          ]}
          style={{ height: "90px" }}
        >
          <Input placeholder="Enter koi name" />
        </Form.Item>

        <Form.Item
          label="Sex"
          name="sex"
          rules={[{ required: true, message: "Please select the sex!" }]}
          style={{ height: "90px" }}
        >
          <Select placeholder="Select sex">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Size (cm)"
          name="sizeCm"
          rules={[
            { required: true, message: "Please enter the size!" },
            { type: "number", min: 1, message: "Size must be greater than 0!" },
          ]}
          style={{ height: "90px" }}
        >
          <InputNumber type="number" placeholder="Enter size in cm" />
        </Form.Item>

        <Form.Item
          label="Weight (kg)"
          name="weightKg"
          rules={[
            { required: true, message: "Please enter the weight!" },
            { type: "number", min: 1, message: "Weight must be greater than 0!" },
          ]}
          style={{ height: "90px" }}
        >
          <InputNumber type="number" placeholder="Enter weight in kg" />
        </Form.Item>

        <Form.Item
          label="Estimated Value"
          name="estimatedValue"
          rules={[
            { required: true, message: "Please enter the estimated value!" },
            { type: "number", min: 0, message: "Value must be a positive number!" },
          ]}
          style={{ height: "90px" }}
        >
          <InputNumber min={0} addonAfter="đ" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 500, message: "Description cannot exceed 500 characters!" }]}
          style={{ height: "90px" }}
        >
          <Input.TextArea placeholder="Enter a description" maxLength={500} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label="Variety"
          name="varietiesID"
          rules={[{ required: true, message: "Please select the variety!" }]}
          style={{ height: "90px" }}
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
          rules={[
            { required: true, message: "Please select the date of birth!" },
            () => ({
              validator(_, value) {
                if (value && value.isAfter(new Date())) {
                  return Promise.reject(new Error("Date must be in the past!"));
                }
                return Promise.resolve();
              },
            }),
          ]}
          style={{ height: "90px" }}
        >
          <DatePicker placeholder="Select date of birth" />
        </Form.Item>

        <Form.Item
          label="Image URL"
          name="image_url"
          rules={[{ required: true, message: "Please upload koi image!" }]}
          style={{ height: "90px" }}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Video URL"
          name="video_url"
          rules={[
            {
              type: "url",
              message: "Please enter a valid URL!",
            },
          ]}
          style={{ height: "90px" }}
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
  const statusOptions = [
    { value: "AVAILABLE", color: "green" },
    { value: "PENDING", color: "yellow" },
    { value: "PENDING_AUCTION", color: "orange" },
    { value: "SELLING", color: "purple" },
    { value: "DELIVER_REQUIRED", color: "red" },
    { value: "DELIVERING_TO_BUYER", color: "teal" },
    { value: "RETURNING", color: "brown" },
    { value: "SOLD", color: "blue" },
    { value: "UNAVAILABLE", color: "gray" },
  ];

  const onChangeFilter = (field, value) => {
    const updatedFilters = { ...filters };

    if (Array.isArray(value) && (field === "WeightKg" || field === "SizeCm")) {
      // If value is an array, assume it's a range and store min and max separately
      updatedFilters[`min${field}`] = value[0];
      updatedFilters[`max${field}`] = value[1];
    } else {
      // For single values, store directly
      updatedFilters[field] = value;
    }

    setFilters(updatedFilters);
    console.log(updatedFilters);
  };
  const filterItems = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "24px",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#f9fafc",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Status Filter */}
      <Form.Item name="status" label="Status" style={{ flex: "1 1 220px" }}>
        <Select
          onChange={(value) => onChangeFilter("status", value)}
          placeholder="Select status"
          allowClear
          style={{ borderRadius: "6px", width: "100%" }}
        >
          {statusOptions.map(({ value, color }) => (
            <Select.Option key={value} value={value}>
              <Tag color={color} style={{ marginRight: "8px" }}>
                {value}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* Sex Filter */}
      <Form.Item name="sex" label="Sex" style={{ flex: "1 1 220px" }}>
        <Select
          onChange={(value) => onChangeFilter("sex", value)}
          placeholder="Select sex"
          allowClear
          style={{ borderRadius: "6px", width: "100%" }}
        >
          <Select.Option value="MALE">Male</Select.Option>
          <Select.Option value="FEMALE">Female</Select.Option>
        </Select>
      </Form.Item>

      {/* Min Size (cm) Filter */}
      <Form.Item name="sizeRangeCm" label="Size (cm)" style={{ flex: "1 1 220px" }}>
        <div className="custom-slider-tooltip">
          <Slider
            range
            min={0}
            max={100} // Adjust max value as needed
            step={1}
            onChange={(value) => onChangeFilter("SizeCm", value)}
            tooltip={{
              open: true,
              getPopupContainer: (trigger) => trigger.parentNode,
            }}
          />
        </div>
      </Form.Item>

      {/* Weight Range (kg) Filter */}
      <Form.Item name="weightRangeKg" label="Weight (kg)" style={{ flex: "1 1 220px" }}>
        <div className="custom-slider-tooltip">
          <Slider
            range
            min={0}
            max={50} // Adjust max value as needed
            step={0.1}
            onChange={(value) => onChangeFilter("WeightKg", value)}
            tooltip={{
              open: true,
              getPopupContainer: (trigger) => trigger.parentNode,
            }}
          />
        </div>
      </Form.Item>

      {/* Min Estimated Value Filter */}
      <Form.Item name="lowerEstimatedValue" label="Min Value" style={{ flex: "1 1 220px" }}>
        <InputNumber
          min={0}
          placeholder="Min estimated value"
          style={{ width: "100%", borderRadius: "6px" }}
          onChange={(value) => onChangeFilter("lowerEstimatedValue", value)}
        />
      </Form.Item>

      {/* Max Estimated Value Filter */}
      <Form.Item name="upperEstimatedValue" label="Max Value" style={{ flex: "1 1 220px" }}>
        <InputNumber
          min={0}
          placeholder="Max estimated value"
          style={{ width: "100%", borderRadius: "6px" }}
          onChange={(value) => onChangeFilter("upperEstimatedValue", value)}
        />
      </Form.Item>

      {/* Variety Filter */}
      <Form.Item name="varietiesName" label="Variety" style={{ flex: "1 1 220px" }}>
        <Select
          mode="multiple"
          placeholder="Select varieties"
          allowClear
          style={{ width: "100%", borderRadius: "6px" }}
          onChange={(value) => onChangeFilter("varietiesName", value)}
        >
          {varieties.map((variety) => (
            <Select.Option key={variety.id} value={variety.name}>
              {variety.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
  return (
    <div style={{ margin: "100px auto" }}>
      <BasicFilter filterItems={filterItems} />
      <DashboardTemplate
        isRerender={render}
        apiURI="koiFish/koiBreeder/pagination/filter"
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
        filterParams={filters}
      />
    </div>
  );
}

export default ManageKoiFish;
