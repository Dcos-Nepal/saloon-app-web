import SideNavbar from 'common/components/layouts/sidebar';
import Footer from 'common/components/layouts/footer';
import { useState } from 'react';
import { connect } from 'react-redux';
import EventActions from 'store/actions/events.actions';
import Modal from 'common/components/atoms/Modal';
import AddBookingForm from './AddBooking';
import { toast } from 'react-toastify';
import { addVisitApi, updateVisitApi } from 'services/visits.service';
import BookingSchedule from './Schedule';

const Tabs = {
    Consulation: 'Consulation',
    Treatment: 'Treatment'
};

const Bookings = (props: any) => {
    const [tab, setTab] = useState(Tabs.Consulation);
    const [bookingDetails, setBookingDetails] = useState('');
    const [addLineItemOpen, setAddLineItemOpen] = useState<boolean>(false);

    const TabContent = () => {
        switch (tab) {
            case Tabs.Consulation:
                return <Consulation />;
            case Tabs.Treatment:
                return <Treatments />;
            default:
                return <div />
        }
    };

    const bookingHandler = (bookingData: any) => {
        setBookingDetails(!!bookingData ? bookingData : '')
    }

    const Consulation = () => {
        return (
            <div className="row">
                <BookingSchedule type={'CONSULATION'} bookingHandler={bookingHandler}/>
            </div>
        );
    };

    const Treatments = () => {
        return (
            <div className="row">
                <BookingSchedule type={'TREATMENT'} bookingHandler={bookingHandler}/>
            </div>
        );
    };

    /**
     * Handles line item Save
     * @param data 
     */
    const addNewBooking = async (data: any) => {
        try {
            await addVisitApi(data);
            toast.success('Booking added successfully');
            setAddLineItemOpen(false);
            setBookingDetails('');
        } catch (ex) {
            toast.error('Failed to add Booking');
        }
    };

    /**
     * Update Booking Information
     * @param id string
     * @param data any
     */
    const updateBooking = async (id: string, data: any) => {
        try {
            await updateVisitApi(id, data);
            toast.success('Booking updated successfully');
            setAddLineItemOpen(false);
            setBookingDetails('');
        } catch (ex) {
            toast.error('Failed to update Booking');
        }
    };

    return (
        <>
            <SideNavbar active="Schedule" />
            <div className="col main-container" style={{ position: 'relative', minHeight: '700px' }}>
                <div className="row d-flex flex-row mb-3">
                    <div className='col-6'>
                        <div className="col">
                            <h3 className="extra">Bookings</h3>
                        </div>
                        <label className="txt-grey">List of bookings scheduled so far. Both the consultations and treatments</label>
                    </div>
                    <div className="col-2">
                        <div className="form-group mt-3 d-flex float-end">
                            <input type="checkbox" className="mt-1" id="toggle-completed" checked={props.completedVisible} onChange={props.toggleCompleted}></input>
                            <label htmlFor="toggle-completed" className='pt-1'>&nbsp;Toggle Completed</label>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group mt-3 d-flex float-end">
                            <input type="checkbox" className="mt-1" id="toggle-weekends" checked={props.weekendsVisible} onChange={props.toggleWeekends}></input>
                            <label htmlFor="toggle-weekends" className='pt-1'>&nbsp;Toggle Weekends</label>
                        </div>
                    </div>
                    <div className='col-2 pt-2'>
                        <button onClick={() => setAddLineItemOpen(true)} type="button" className="btn btn-primary d-flex float-end">
                            Add Booking
                        </button>
                    </div>
                </div>
                <div className="">
                    <div className="row mt-3">
                        <div className={`col tab me-1 ${tab === Tabs.Consulation ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Consulation)}>
                            Consulations
                        </div>
                        <div className={`col tab me-1 ${tab === Tabs.Treatment ? 'active-tab' : ''}`} onClick={() => setTab(Tabs.Treatment)}>
                            Treatments
                        </div>
                    </div>
                    {<TabContent />}
                </div>
                <Footer />
            </div>
            <Modal isOpen={!!addLineItemOpen || !!bookingDetails} onRequestClose={() => setAddLineItemOpen(false)}>
                <AddBookingForm closeModal={() => {
                    setAddLineItemOpen(false);
                    setBookingDetails('');
                }}
                saveHandler={addNewBooking}
                updateHandler={updateBooking}
                bookingDetails={bookingDetails}/>
            </Modal>
        </>
    );
};

/**
 * Maps state to the props
 *
 * @returns Object
 */
function mapStateToProps() {
    return (state: any) => {
        return {
            weekendsVisible: state.weekendsVisible,
            completedVisible: state.completedVisible
        };
    };
}

export default connect(mapStateToProps, { ...EventActions })(Bookings);
