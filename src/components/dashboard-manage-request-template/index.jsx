import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Image,
  Row,
  Col,
  Alert,
  Space,
  Tooltip,
} from "antd";
import { DeleteOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons"; // Ant Design icons for action buttons
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import api from "../../config/axios";
import dayjs from "dayjs";
import CardKoiFish from "../card-koi-fish";

function DashboardManageRequestTemplate({
  columns,
  title,
  formItems,
  apiURI,
  dateFields = [],
  keyField,
  formViewDetailsItem,
  isBasicCRUD,
  isIncludeImage,
  isRerender,
  form,
  apiUriPOST,
  apiUriPUT,
  apiUriDelete,
  formViewDetails,
  isShownCardKoiFish,
  isCreateNew,
}) {
  const [dataSource, setDataSource] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tableColumns, setTableColumns] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [actions, setActions] = useState();

  // Define the statuses for which actions are not allowed
  const disabledStatuses = [
    "ACCEPTED BY STAFF",
    "REJECTED BY STAFF",
    "APPROVED BY MANAGER",
    "REJECTED BY MANAGER",
  ];

  useEffect(() => {
    fetchData();
  }, [isRerender]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newColumns = [
      ...columns,
      {
        title: "Action",
        dataIndex: keyField,
        key: keyField,
        render: (id, record) => (
          <Space size="middle">
            <Tooltip title="Reject Request">
              {record.status === "PENDING" ? (
                <Popconfirm
                  title={`Delete ${title}`}
                  description="Are you sure to reject this request?"
                  onConfirm={() => {
                    setIsUpdate(true);
                    handleOpenModal();
                    form.setFieldsValue({ [keyField]: id });
                    setActions(apiUriDelete);
                  }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="blur-button"
                />
              )}
            </Tooltip>
            <Tooltip title="Approve Request">
              {record.status === "PENDING" ? (
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={() => {
                    setIsUpdate(true);
                    handleOpenModal();
                    form.setFieldsValue({ [keyField]: id });
                    setActions(apiUriPUT);
                  }}
                />
              ) : (
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  icon={<CheckOutlined />}
                  size="small"
                  className="blur-button"
                />
              )}
            </Tooltip>
            <Tooltip title="View Details">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  const newRecord = { ...record };
                  setCurrentRecord(newRecord);
                  setIsViewModalOpen(true);
                  for (var key of Object.keys(newRecord)) {
                    const value = newRecord[key];
                    if (dateFields.includes(key)) {
                      newRecord[key] = dayjs(value);
                    } else {
                      newRecord[key] = record[key];
                    }
                  }
                  formViewDetails.setFieldsValue(newRecord);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
    setTableColumns(newColumns);
  }, [columns]);

  const fetchData = async () => {
    try {
      const response = await api.get(apiURI);
      console.log("fetched");
      setIsFetching(false);
      setDataSource(response.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    }
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    form.resetFields();
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentRecord(null);
  };

  const handleSubmitForm = async (values) => {
    setLoading(true);
    try {
      await api.put(`${actions}/${values[keyField]}`, values);
      toast.success("Successfully updated");
      form.resetFields();
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(error.response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.put(`${apiUriDelete}/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  return (
    <div>
      {isCreateNew ? (
        <Button
          onClick={() => {
            setIsUpdate(false);
            handleOpenModal();
          }}
          type="primary"
        >
          Add new {title}
        </Button>
      ) : (
        []
      )}

      <Table columns={tableColumns} dataSource={dataSource} loading={isFetching} />
      <Modal
        open={isOpenModal}
        title={isUpdate === true ? `Edit ${title}` : `Create new ${title}`}
        onCancel={handleCloseModal}
        footer={
          <>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              onClick={() => {
                form.submit();
              }}
              loading={loading}
            >
              Save
            </Button>
          </>
        }
      >
        <Form labelCol={{ span: 24 }} onFinish={handleSubmitForm} form={form}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          {formItems}
        </Form>
      </Modal>
      <Modal
        width={800}
        open={isViewModalOpen}
        title={`View ${title} details`}
        onCancel={handleCloseViewModal}
        footer={<Button onClick={handleCloseViewModal}>Close</Button>}
      >
        <Form labelCol={{ span: 24 }} form={formViewDetails}>
          <Form.Item name={keyField} hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>{formViewDetailsItem}</Col>
            <Col span={12}>
              {isShownCardKoiFish && <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} />}
              {isIncludeImage ? (
                <Form.Item label="Image" name="image_url">
                  {currentRecord && currentRecord.image_url ? (
                    <Image width={200} src={currentRecord.image_url} />
                  ) : (
                    <span>No image available</span>
                  )}
                </Form.Item>
              ) : (
                []
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
      <style jsx>{`
        .blur-button {
          opacity: 0.5; /* Make the button appear faded */
          pointer-events: none; /* Disable mouse events for blurred buttons */
        }
      `}</style>
    </div>
  );
}

export default DashboardManageRequestTemplate;
