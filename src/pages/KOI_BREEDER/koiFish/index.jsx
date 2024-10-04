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
  const [hongthinh, setHongThinh] = useState(false);
  const [form] = useForm();
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
    {
      title: "Status",
      dataIndex: "koiStatus",
      key: "koiStatus",
      render: (s) => {
        const checkStatus = s == "AVAILABLE" ? "green" : s === "PENDING_AUCTION" ? "yellow" : "red";
        return <Tag color={checkStatus}>{s}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "koi_id",
      key: "koi_id",
      render: (id, record) => (
        <Button
          onClick={() => {
            setIsOpenModal(true);
            const newRecord = { ...record };
            form.setFieldsValue(newRecord);
          }}
        >
          Update Health status
        </Button>
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

  const handleSubmitForm = async (values) => {
    try {
      const response = await api.put(`koiFish/health/${values.koi_id}`, {
        koi_status: values.koiStatus,
        healthNote: values.healthNote,
      });
      toast.success("Updated!!!");
      setHongThinh((prev) => !prev);//set isRenderer to make column in dashboard template re-rendered
    } catch (error) {
      console.log(error);
    }
    setIsOpenModal(false);
    form.resetFields();
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
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setHealth(e.target.value);
  };
  const formUpdateHealthStatus = (
    <Form
      onFinish={(values) => {
        //after submit
        handleSubmitForm(values);
      }}
      form={form}
    >
      <Form.Item label="Status" name={"koiStatus"}>
        <Radio.Group onChange={onChange} value={health}>
          <Radio value={"AVAILABLE"}>Good</Radio>
          <Radio value={"UNAVAILABLE"}>Not good</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Reason : " name={"healthNote"}>
        <Input />
      </Form.Item>
      <Form.Item name={"koi_id"} hidden>
        <Input type="number" />
      </Form.Item>
    </Form>
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

      <Form.Item label="Health note : " name="healthNote">
        <Input disabled placeholder="Enter video URL" />
      </Form.Item>
    </>
  );
  return (
    <div style={{ margin: "100px auto" }}>
      <DashboardTemplate
        isRerender={hongthinh}
        apiURI="koiFish"
        formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"bornIn"}
        keyField={"koi_id"}
        formViewDetails={formViewDetailsItems}
        isBasicCRUD={false}
      />
      <Modal
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
        open={isOpenModal}
      >
        {formUpdateHealthStatus}
      </Modal>
    </div>
  );
}

export default ManageKoiFish;
