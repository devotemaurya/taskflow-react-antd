import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { taskApi, TaskCreateRequest } from '@/services/api';

const { TextArea } = Input;

interface TaskFormProps {
  onTaskCreated: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: TaskCreateRequest) => {
    setLoading(true);
    try {
      await taskApi.createTask(values);
      message.success('Task created successfully!');
      form.resetFields();
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      message.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Create New Task" 
      className="mb-6"
      extra={<PlusOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Task Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter a task name!' },
              { min: 2, message: 'Task name must be at least 2 characters!' },
              { max: 100, message: 'Task name cannot exceed 100 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter task name..."
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label="Command"
            name="command"
            rules={[
              { required: true, message: 'Please enter a command!' },
              { min: 1, message: 'Command cannot be empty!' },
              { max: 500, message: 'Command cannot exceed 500 characters!' }
            ]}
          >
            <Input 
              placeholder="e.g., npm test, python script.py..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description (Optional)"
          name="description"
          rules={[
            { max: 500, message: 'Description cannot exceed 500 characters!' }
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Describe what this task does..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<PlusOutlined />}
            size="large"
          >
            Create Task
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TaskForm;