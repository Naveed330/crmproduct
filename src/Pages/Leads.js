import React, { useState, useEffect } from 'react';
import Navbar from '../Components/navbar/Navbar';
import Sidebar from '../Components/sidebar/Sidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Row, Col, Card, Spin, Button } from 'antd';

// Define the Products
const products = [
    { id: 0, name: 'Business Banking' },
    { id: 1, name: 'Mortgage Loan' },
    { id: 2, name: 'Personal Loan' },
    { id: 3, name: 'Real Estate' },
];

// Define the stages
const stages = [
    { id: 2, name: 'New Lead', order: 1 },
    { id: 0, name: 'Marketing Lead', order: 2 },
    { id: 1, name: 'Follow Up', order: 3 },
    { id: 3, name: 'Rejected', order: 4 },
    { id: 4, name: 'Under Calculation', order: 5 },
    { id: 5, name: 'Final discussion', order: 6 },
    { id: 6, name: 'Service App Req', order: 7 },
];

const Leads = () => {
    const [leadData, setLeadsData] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productNames, setProductNames] = useState(products.map(p => p.name));
    const [selectedProduct, setSelectedProduct] = useState('All');
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [getBranchData, setGetBranchData] = useState([]);
    const token = useSelector(state => state.loginSlice.user?.token);
    const loginUserBranch = useSelector(state => state.loginSlice.user?.branch);
    const userRole = useSelector(state => state.loginSlice.user?.role); // Add this line

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const getResponseBranchData = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/branch/get-branches`);
                setGetBranchData(getResponseBranchData.data);
            } catch (error) {
                console.log(error, 'err');
            }
        };
        fetchBranchData();
    }, []);

    useEffect(() => {
        const fetchLeadData = async () => {
            if (!token) {
                console.log('Token missing');
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/leads/get-leads`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const leads = response.data.leads;

                // Filter leads to include only those with stages in the stages array
                const validStages = new Set(stages.map(stage => stage.name));
                const filteredLeads = leads.filter(lead => validStages.has(lead.stage?.name));
                setLeadsData(filteredLeads);

                // Filter and format products to match predefined names
                setFilteredLeads(filteredLeads);

            } catch (error) {
                console.error('Error Fetching Leads:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadData();
    }, [token]);

    useEffect(() => {
        let filtered = leadData;
        if (selectedProduct && selectedProduct !== 'All') {
            filtered = filtered.filter(lead => lead.products === selectedProduct);
        }
        if (selectedBranch) {
            filtered = filtered.filter(lead => lead.branch?._id === selectedBranch);
        }
        setFilteredLeads(filtered);
    }, [selectedProduct, selectedBranch, leadData]);

    const groupLeadsByStageAndProduct = () => {
        const grouped = {};
        stages.forEach(stage => {
            grouped[stage.name] = {};
        });

        filteredLeads.forEach(lead => {
            const stage = lead.stage?.name || 'Unknown Stage';
            const product = lead.products || 'Unknown Product';

            // Only group by stages that are in the predefined stages list
            if (grouped.hasOwnProperty(stage)) {
                if (!grouped[stage]) {
                    grouped[stage] = {};
                }
                if (!grouped[stage][product]) {
                    grouped[stage][product] = [];
                }
                grouped[stage][product].push(lead);
            }
        });

        return grouped;
    };

    const groupedLeads = groupLeadsByStageAndProduct();

    // Determine if the "All" button should be shown
    const showAllButton = !['CEO', 'MD', 'Superadmin'].includes(userRole);

    return (
        <div>
            <Navbar />
            <Row>
                <Col xs={24} sm={24} md={6} lg={4}>
                    <Sidebar />
                </Col>
                <Col xs={24} sm={24} md={18} lg={20}>
                    <div style={{ marginTop: '5%' }}>
                        <h1>Lead Data</h1>
                        {loginUserBranch === null && (
                            <div style={{ display: 'flex', gap: '10px' }} >
                                {getBranchData.map((branch) => (
                                    <Button
                                        key={branch._id}
                                        style={{ marginBottom: '20px' }}
                                        onClick={() => setSelectedBranch(branch._id)}
                                        type={selectedBranch === branch._id ? 'primary' : 'default'}
                                    >
                                        {branch.name}
                                    </Button>
                                ))}
                            </div>
                        )}
                        {loading ? (
                            <Spin tip="Loading Leads..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }} />
                        ) : (
                            <div>
                                <div style={{ marginBottom: '20px' }}>
                                    {showAllButton && (
                                        <Button
                                            onClick={() => setSelectedProduct('All')}
                                            style={{ margin: '0 5px' }}
                                            type={selectedProduct === 'All' ? 'primary' : 'default'}
                                        >
                                            All
                                        </Button>
                                    )}
                                    {productNames.map((productName, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => setSelectedProduct(productName)}
                                            style={{ margin: '0 5px' }}
                                            type={selectedProduct === productName ? 'primary' : 'default'}
                                        >
                                            {productName}
                                        </Button>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', width: '100%', maxWidth: '1400px', overflowX: 'scroll', padding: '0 30px' }}>
                                    {Object.keys(groupedLeads).length > 0 ? (
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            {Object.keys(groupedLeads).map(stageName => (
                                                <div key={stageName} style={{ width: '100%' }} >
                                                    <h2 style={{ textAlign: 'center' }}>{stageName}</h2>
                                                    {Object.keys(groupedLeads[stageName]).length > 0 ? (
                                                        Object.keys(groupedLeads[stageName]).map(productName => (
                                                            <Card
                                                                key={productName}
                                                                title={productName}
                                                                bordered={true}
                                                                style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px', width: '100%' }}
                                                            >
                                                                {groupedLeads[stageName][productName].map((lead, index) => (
                                                                    <div key={index}>
                                                                        <p><strong>Client Name:</strong> {lead.client?.name}</p>
                                                                        <p><strong>Pipeline:</strong> {lead.pipeline_id?.name}</p>
                                                                        <hr />
                                                                    </div>
                                                                ))}
                                                            </Card>
                                                        ))
                                                    ) : (
                                                        <p>No Data Available</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ textAlign: 'center' }}>No Leads Available for this Product.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Leads;
