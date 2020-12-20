import React, { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
    Spinner,
    Table,
    Button,
    Label,
    Input,
    Row,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import { getcontacts, clearcontacts } from './redux/actions';

const Common_modal = (props) => {
    const [search_text, set_search_text] = useState('');
    const [modal_visible, set_modal_visible] = useState(false);
    const [contact_details, set_contact_details] = useState(null);
    const [even_contacts, set_even_contacts] = useState(false);

    const dispatch = useDispatch();
    const data = useSelector(state => state);
    const filterSelector = createSelector(
        state => state.contacts?.contacts_ids,
        items => items?.map((item) => {
            if (even_contacts) {
                if (item % 2 === 0) {
                    return item;
                }
                return null;
            } else {
                return item;
            }
        }).filter((val) => val !== null)
    );
    const filtered_ids = filterSelector(data);

    useEffect(() => {
        if (props.modal_Id === 1) {
            dispatch(getcontacts({ page: 1, companyId: 171 }));
        } else {
            dispatch(getcontacts({ page: 1, companyId: 171, countryId: 226 }));
        }
    }, [dispatch, props.modal_Id]);

    const handleAboutToReachBottom = () => {
        if (data.contacts && !data.api_call_pagination && data.contacts.total !== 0 && !(Math.ceil(data.contacts.total / 20) === data.contacts.page)) {
            let params = {
                page: data.contacts.page + 1,
                companyId: 171,
                query: search_text
            }
            if (props.modal_Id === 2) {
                params.countryId = 226
            }
            dispatch(getcontacts(params, true));
        }
    }

    const handleUpdate = (values) => {
        const { scrollTop, scrollHeight, clientHeight } = values;
        const pad = 100;
        const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
        if (t > 1) handleAboutToReachBottom();
    }

    const on_search_change = (text) => {
        set_search_text(text);
        setTimeout(() => {
            if (!data.api_call) {
                dispatch(clearcontacts());
                if (props.modal_Id === 1) {
                    dispatch(getcontacts({ page: 1, companyId: 171, query: text }));
                } else {
                    dispatch(getcontacts({ page: 1, companyId: 171, countryId: 226, query: text }));
                }
            }
        }, 1000);
    }

    const on_enter_click = () => {
        if (!data.api_call) {
            dispatch(clearcontacts());
            if (props.modal_Id === 1) {
                dispatch(getcontacts({ page: 1, companyId: 171, query: search_text }));
            } else {
                dispatch(getcontacts({ page: 1, companyId: 171, countryId: 226, query: search_text }));
            }
        }
    }

    return (
        <Modal isOpen size='xl'>
            <ModalBody>
                <Row className='border-bottom p-2 pb-3'>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn button-a' onClick={() => {
                            if (props.modal_Id === 2) {
                                dispatch(clearcontacts());
                                props.history.push('/modal_a');
                            }
                        }}>All contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn button-b' onClick={() => {
                            if (props.modal_Id === 1) {
                                dispatch(clearcontacts());
                                props.history.push('/modal_b')
                            }
                        }}>US contacts</Button>
                    </Col>
                    <Col sm='12' md='4' className='d-flex justify-content-center'>
                        <Button className='btn button-c border-2' onClick={() => {
                            dispatch(clearcontacts());
                            props.history.push('/');
                        }}>Close</Button>
                    </Col>
                </Row>
                <Input type='text' className='mt-2 border-2 rounded' placeholder='Search...'
                    onChange={(event) => {
                        on_search_change(event.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            on_enter_click();
                        }
                    }} />
                <Scrollbars className='mt-3' autoHeight autoHeightMin={400} onUpdate={handleUpdate}>
                    {
                        data.api_call ?
                            <div className='w-100 d-flex align-items-center justify-content-center'>
                                <Spinner />
                            </div>
                            :
                            <Table className="table table-striped table-dark">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Phone Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filtered_ids?.map((item, index) => {
                                            return (
                                                <tr key={item} onClick={() => {
                                                    set_contact_details(data.contacts.contacts[item]);
                                                    set_modal_visible(!modal_visible);
                                                }}>
                                                    <td>{item}</td>
                                                    <td>{data.contacts.contacts[item].first_name}</td>
                                                    <td>{data.contacts.contacts[item].last_name}</td>
                                                    <td>{data.contacts.contacts[item].phone_number}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        data.api_call_pagination &&
                                        <tr>
                                            <td colSpan={5} className='text-center'>
                                                <Spinner />
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                    }
                </Scrollbars>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-start pl-5'>
                <Label check>
                    <Input type="checkbox" value={even_contacts} onChange={() => set_even_contacts(!even_contacts)} />{' '}
                         Only even
                </Label>
            </ModalFooter>
            <Modal isOpen={modal_visible}>
                <ModalHeader toggle={() => {
                    set_contact_details(null);
                    set_modal_visible(!modal_visible);
                }}>
                    Details
                </ModalHeader>
                <ModalBody>
                    {
                        contact_details &&
                        <div>
                            First Name: {contact_details.first_name}<br />
                            Last Name: {contact_details.last_name}<br />
                            Phone Number: {contact_details.phone_number}
                        </div>
                    }
                </ModalBody>
            </Modal>
        </Modal >
    )
}

export default Common_modal;