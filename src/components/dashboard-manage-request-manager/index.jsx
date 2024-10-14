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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import api from "../../config/axios";
import dayjs from "dayjs";
import CardKoiFish from "../card-koi-fish";
import moment from "moment";
import {
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";

function DashboardManageRequestTemplateForManager({
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
  formCreateAuctionSession,
  formItemsCreateAuctionSession,
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
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);

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
        render: (id, record) => {
          if (record.status === "APPROVED_BY_MANAGER") {
            return (
              <Alert
                message="This request is approved"
                type="success"
                showIcon
                icon={<CheckOutlined style={{ color: "green" }} />}
                style={{
                  marginBottom: 8,
                  border: "1px solid green",
                  borderRadius: 4,
                }}
              />
            );
          }
          if (record.status === "REJECTED_BY_MANAGER") {
            return (
              <Alert
                message="This request is rejected"
                type="error"
                showIcon
                icon={<CloseOutlined style={{ color: "red" }} />}
                style={{
                  marginBottom: 8,
                  border: "1px solid red",
                  borderRadius: 4,
                }}
              />
            );
          }

          return (
            <Space size="middle">
              <Tooltip title="Reject Request">
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
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Approve Request">
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={() => {
                    setIsUpdate(true);
                    handleOpenAuctionModal();
                    form.setFieldsValue({ [keyField]: id });
                    formCreateAuctionSession.setFieldsValue({
                      auction_request_id: id,
                    });
                    setActions(apiUriPUT);
                  }}
                />
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
          );
        },
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
  const handleOpenAuctionModal = () => {
    setIsAuctionModalOpen(true);
  };
  const handleCloseAuctionModal = () => {
    setIsAuctionModalOpen(false);
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

  const handleSubmitAuctionSessionForm = async (values) => {
    setLoading(true);
    try {
      await api.put(`auctionRequest/approve/${values[keyField]}`, {
        responseNote: "",
      });
      await api.post(`auctionSession`, values);
      toast.success("Successfully created auction session");
      formCreateAuctionSession.resetFields();
      handleCloseAuctionModal();
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

      <Table
        columns={tableColumns}
        dataSource={dataSource}
        loading={isFetching}
      />
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
              {isShownCardKoiFish && (
                <CardKoiFish id={formViewDetails.getFieldValue("koi_id")} />
              )}
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
      <Modal
        title="Create Auction Session"
        open={isAuctionModalOpen}
        onCancel={handleCloseAuctionModal}
        footer={
          <>
            <Button onClick={handleCloseAuctionModal}>Cancel</Button>
            <Button
              onClick={() => {
                formCreateAuctionSession.submit();
              }}
              loading={loading}
            >
              Save
            </Button>
          </>
        }
      >
        <Form
          onFinish={handleSubmitAuctionSessionForm}
          form={formCreateAuctionSession}
          layout="vertical"
          initialValues={{
            startDate: moment(new Date()),
            endDate: moment(new Date()).add(1, "days"),
            auctionType: "ASCENDING",
          }}
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          {formItemsCreateAuctionSession}
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardManageRequestTemplateForManager;
