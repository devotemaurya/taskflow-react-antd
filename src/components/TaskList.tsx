import React from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Popconfirm, 
  message, 
  Modal, 
  Typography, 
  Tag,
  Tooltip 
} from 'antd';
import { 
  DeleteOutlined, 
  PlayCircleOutlined, 
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import { taskApi, Task, TaskExecutionResponse } from '@/services/api';

const { Search } = Input;
const { Text, Paragraph } = Typography;

interface TaskListProps {
  refreshTrigger: number;
}

const TaskList: React.FC<TaskListProps> = ({ refreshTrigger }) => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [executionResult, setExecutionResult] = React.useState<TaskExecutionResponse | null>(null);
  const [executionModalVisible, setExecutionModalVisible] = React.useState(false);
  const [executingTaskId, setExecutingTaskId] = React.useState<string | null>(null);

  const fetchTasks = React.useCallback(async (name?: string) => {
    setLoading(true);
    try {
      const data = await taskApi.getTasks(name);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks(searchTerm || undefined);
  }, [fetchTasks, searchTerm, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      message.success('Task deleted successfully!');
      fetchTasks(searchTerm || undefined);
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task. Please try again.');
    }
  };

  const handleExecute = async (id: string) => {
    setExecutingTaskId(id);
    try {
      const result = await taskApi.executeTask(id);
      setExecutionResult(result);
      setExecutionModalVisible(true);
      message.success('Task executed successfully!');
    } catch (error) {
      console.error('Error executing task:', error);
      message.error('Failed to execute task. Please try again.');
    } finally {
      setExecutingTaskId(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text: string) => (
        <Text strong className="text-base">
          {text}
        </Text>
      ),
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      width: '30%',
      render: (text: string) => (
        <Text code className="bg-gray-50 px-2 py-1 rounded">
          {text}
        </Text>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      render: (text: string) => (
        text ? (
          <Paragraph ellipsis={{ rows: 2, tooltip: text }} className="mb-0">
            {text}
          </Paragraph>
        ) : (
          <Text type="secondary" italic>No description</Text>
        )
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render: (date: string) => (
        <Tag color="blue">
          {new Date(date).toLocaleDateString()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Task) => (
        <Space size="small">
          <Tooltip title="Execute task">
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecute(record.id)}
              loading={executingTaskId === record.id}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Task"
            description="Are you sure you want to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete task">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Search
            placeholder="Search tasks by name..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => {
              if (!e.target.value) {
                setSearchTerm('');
              }
            }}
            className="w-96"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchTasks(searchTerm || undefined)}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
        <Text type="secondary">
          Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} tasks`,
        }}
        className="bg-white rounded-lg shadow-sm"
      />

      <Modal
        title="Task Execution Result"
        open={executionModalVisible}
        onCancel={() => setExecutionModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setExecutionModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {executionResult && (
          <div className="space-y-4">
            <div>
              <Text strong>Exit Code: </Text>
              <Tag color={executionResult.exitCode === 0 ? 'green' : 'red'}>
                {executionResult.exitCode}
              </Tag>
            </div>
            <div>
              <Text strong>Executed At: </Text>
              <Text>{new Date(executionResult.executedAt).toLocaleString()}</Text>
            </div>
            <div>
              <Text strong>Output:</Text>
              <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {executionResult.output || 'No output'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TaskList;