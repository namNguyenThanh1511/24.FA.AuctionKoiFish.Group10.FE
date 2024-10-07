import { Form, Input, Select, DatePicker, Upload, Button, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

const KoiFishForm = ({ onSubmit, props }) => {
  const [form] = Form.useForm();
  const [varieties, setVarieties] = useState([]);
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
  const handleFinish = (values) => {
    // This will be called when form submission is successful
    onSubmit(values); // Pass values to the parent component or API
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      {/* Name and Sex in one row */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
            style={{ paddingBottom: "16px" }}
          >
            <Input placeholder="Enter koi name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sex"
            name="sex"
            rules={[{ required: true, message: "Please select the sex!" }]}
            style={{ paddingBottom: "16px" }}
          >
            <Select placeholder="Select sex">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Size, Weight, and Estimated Value in one row */}
      <Row
        gutter={20}
        style={{
          padding: "10px 0",
        }}
      >
        <Col span={8}>
          <Form.Item
            label="Size (cm)"
            name="sizeCm"
            rules={[{ required: true, message: "Please enter the size!" }]}
            style={{ paddingBottom: "16px" }}
          >
            <Input type="number" placeholder="Enter size in cm" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Weight (kg)"
            name="weightKg"
            rules={[{ required: true, message: "Please enter the weight!" }]}
            style={{ paddingBottom: "16px" }}
          >
            <Input type="number" placeholder="Enter weight in kg" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Estimated Value"
            name="estimatedValue"
            rules={[{ required: true, message: "Please enter the estimated value!" }]}
            style={{ paddingBottom: "16px" }}
          >
            <Input type="number" placeholder="Enter estimated value" />
          </Form.Item>
        </Col>
      </Row>

      {/* Variety and Date of Birth in one row */}
      <Row
        gutter={10}
        style={{
          margin: "12px 0",
        }}
      >
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Form.Item
            label="Date of Birth"
            name="bornIn"
            rules={[{ required: true, message: "Please select the date of birth!" }]}
          >
            <DatePicker placeholder="Select date of birth" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Description" name="description" style={{ padding: "10px 0 50px 0" }}>
        <Input.TextArea placeholder="Enter a description" />
      </Form.Item>
    </Form>
  );
};

export default KoiFishForm;
