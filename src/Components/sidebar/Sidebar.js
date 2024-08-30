import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
    {
        key: 'sub2',
        label: 'Navigation One',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: '1',
                label: 'Super Admin',
                route: '/superadmindashboard', // Add route if needed
            },
            {
                key: '2',
                label: 'Users',
                route: '/allusers', // Add route here
            },
            {
                key: '3',
                label: 'Leads',
                route: '/leads', // Add route if needed
            },
        ],
    },

    {
        type: 'divider',
    },
];

const Sidebar = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const onClick = (e) => {
        const item = items.flatMap((i) => i.children || []).find((child) => child.key === e.key);
        if (item && item.route) {
            navigate(item.route); // Navigate to the route
        }
    };

    return (
        <Menu
            onClick={onClick}
            style={{
                width: 256,
                position: 'fixed',
                top: 64,
                left: 0,
                height: '100vh',
                overflow: 'auto',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    );
};

export default Sidebar;
