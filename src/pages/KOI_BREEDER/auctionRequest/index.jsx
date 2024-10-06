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
  Alert,
  Table,
  Card,
  Row,
} from "antd";
import DashboardTemplate from "../../../components/dashboard-manage-template";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import formatToVND from "../../../utils/currency";
import { useForm } from "antd/es/form/Form";

function ManageAuctionRequestOfKoiBreeder() {
  const title = "Auction Request";
  const [varieties, setVarieties] = useState([]);
  const [health, setHealth] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [hongthinh, setHongThinh] = useState(false);
  const [fishList, setFishList] = useState([]); // State to hold fetched fish
  const [selectedFish, setSelectedFish] = useState(null); // State for the selected fish

  const [form] = useForm();
  const koiColumns = [
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
      title: "Action",
      key: "action",
      render: (_, fish) => <Button onClick={() => handleFishSelect(fish)}>Select</Button>,
    },
  ];
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Created at",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Response Note",
      dataIndex: "responseNote",
      key: "responseNote",
      render: (response, record) => (
        <>
          {record.status === "PENDING" ? (
            ""
          ) : (record.status === "ACCEPTED_BY_STAFF") |
            (record.status === "APPROVED_BY_MANAGER") ? (
            <Alert message={response} type="success" />
          ) : (
            <Alert message={response} type="error" />
          )}
        </>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const checkStatus =
          (s == "ACCEPTED_BY_STAFF") | (s == "APPROVED_BY_MANAGER")
            ? "green"
            : s === "PENDING"
            ? "yellow"
            : "red";
        return <Tag color={checkStatus}>{s}</Tag>;
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

  // Fetch fish data
  const fetchFish = async () => {
    try {
      const response = await api.get("koiFish/koiBreeder/available"); // Adjust the endpoint as necessary
      setFishList(response.data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchVarieties();
    fetchFish(); // Fetch fish data when component mounts
  }, []);

  const handleFishSelect = (fish) => {
    setSelectedFish(fish); // Set the selected fish
    setIsOpenModal(false); // Close the modal
    form.setFieldsValue({
      koiFish_id: fish?.koi_id, // Assuming you want to fill the description with koi_id
    });
  };

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
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
      }}
    >
      <div>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button style={{ textAlign: "center" }} onClick={() => setIsOpenModal(true)}>
            Select Fish
          </Button>
        </div>
        <Form.Item
          hidden
          label="Description"
          name={"koiFish_id"}
          rules={[{ required: true, message: "Please enter description!" }]}
        >
          <Input value={selectedFish?.koi_id} />
        </Form.Item>
      </div>

      {selectedFish && (
        <Card
          style={{ width: 300, marginTop: 16 }}
          actions={[
            <Button danger key={1} type="default" onClick={() => setSelectedFish(null)}>
              Remove
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center" }}>
            <Image width={100} src={selectedFish.image_url} />
            <div style={{ marginTop: 16 }}>
              <Tag color="geekblue">{selectedFish.name}</Tag>
              <Tag color="volcano">{selectedFish.sex}</Tag>
            </div>
            <p style={{ marginTop: 8 }}>
              <strong>Size:</strong> {selectedFish.sizeCm} cm
            </p>
            <p>
              <strong>Weight:</strong> {selectedFish.weightKg} kg
            </p>
          </div>
        </Card>
      )}

      <Modal
        width={1300}
        title="Select Fish"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
      >
        <Table dataSource={fishList} columns={koiColumns} />
      </Modal>
    </div>
  );

  console.log(selectedFish);

  const formViewDetailsItems = (
    <>
      <Form.Item label="Title" name="title">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Created at" name="createdDate">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Response note" name="responseNote">
        <Input style={{ color: "red" }} disabled />
      </Form.Item>
    </>
  );

  return (
    <div style={{ margin: "100px auto" }}>
      <DashboardTemplate
        form={form}
        isRerender={hongthinh}
        apiUriPOST="auctionRequest"
        formItems={formItems}
        title={title}
        columns={columns}
        dateFields={"createdDate"}
        keyField={"koi_id"}
        formViewDetails={formViewDetailsItems}
        isBasicCRUD={false}
        isIncludeImage={false}
        apiURI={"auctionRequest/koiBreeder"}
      />
    </div>
  );
}

export default ManageAuctionRequestOfKoiBreeder;
