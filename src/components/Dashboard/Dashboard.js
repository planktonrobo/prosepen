import { useEffect, useContext } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Timeline from "./Timeline";
import Header from "../Header/Header";
import { Container, Col } from "react-bootstrap";
import LoggedInUserContext from '../../context/logged-in-user';
import UserContext from '../../context/user';
import './styles.scss'
const Dashboard = () => {
  const { userfire } = useContext(
    LoggedInUserContext
  );
const { user } = useContext(
    UserContext
  );
 
  const { user: { docId = '', username, userId, following, picture } = {} } = userfire 
  useEffect(() => {
    document.title = "ProsePen";
  }, []);

  return (
    <>
      
        <Header user={user} picture={picture} username={username}/>
      
    
            <Container className="container-smooth " style={{paddingTop: 80,
    padding: '80px auto auto', minHeight:"100vh"}}>
            <div className="row justify-content-center ">
            <Col xs={12} md={4} className="order-md-2 px-md-0" style={{position: 'static'}} >
           
            <Sidebar user={user} following={following} docId={docId} userId={userId}/>
         
          </Col>      
          <Col xs={12} md={8} style={{maxWidth:650, position: 'static'}} className="order-md-1 ">
          
            <Timeline userId={user?.uid} following={following}/>
          
          </Col>
          
          </div>
          </Container>
    
    </>
  );
};

export default Dashboard;
