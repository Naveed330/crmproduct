import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/loginSlice';
import JoveraLogoweb from '../../Assets/JoveraLogoweb.png';

const { Header } = Layout;

const menuItems = [
    { key: '1', label: 'Business Loan' },
    { key: '2', label: 'Personal Loan' },
    { key: '3', label: 'Real Estate Loan' },
    { key: '4', label: 'Mortgage Loan' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/');
    };

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'fixed',
                    width: '100%',
                    zIndex: 1,
                }}
            >
                <div className="logo" style={{ flex: 1 }}>
                    <img src={JoveraLogoweb} alt="Logo" style={{ height: '50px' }} />
                </div>

                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    style={{
                        flex: 2,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                />
                <Button danger onClick={logoutHandler} style={{ cursor: 'pointer' }} >Logout</Button>
            </Header>
        </Layout>
    );
};

export default Navbar;
