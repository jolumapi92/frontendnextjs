import Link from "next/link";
import { Container } from "react-bootstrap";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { socket } from '../public/service.js'
import { clearDatabase } from '../public/databaseService.js/deleteServiceDB.js'
import { useRouter } from 'next/router'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { login, logout  } from './redux/features/userSlice.js'

const NavbarForApp = () => {
    //Redux
    const user = useSelector( (state) => state.user.value );
    const dispatch = useDispatch();
    //React
    const router = useRouter();
    const [auth, setAuth] = useState(null);
    const [ teacher, setTeacher ] = useState(false);
    const [ online, setOnline ] = useState("Connecting...");
    const [ title, setTitle ] = useState('Daily');

    useEffect(() => {
        
        socket.on('username', (payload) => {
            let firstname = payload.split(' ')[0]
            dispatch( login(firstname) );
        })

        socket.on("connect", () => {
            setOnline('Online')
            console.log("Succesfully connected to the socket");
        });
        
        socket.on("disconnect", () => {
        setOnline("Offline");
        setTitle("Daily");
        dispatch( login("unknown") );
        console.log("Succesfully disconnectedof the socket");
        })
        


       if(window.localStorage.Auth){
            setOnline('offline')
           setAuth(localStorage.getItem('Auth'));
       } else {
           setAuth(null)
       }

       if(window.localStorage.Teacher === "true") {
           setTeacher(localStorage.getItem('Teacher'));
       } else {
           setTeacher(null)
       }

    }, [auth, socket]);

    const handleLogOut = () => {
        clearDatabase();
        window.localStorage.removeItem('Auth');
        setAuth(null);
        dispatch( logout("unknown") );
        router.push('/');
    }

    return ( 
        <>
            <Navbar id="navbar-canvas-off-mine" expand={false}>
                <Container fluid>
                    <Navbar.Brand id="navbar-logo-mine" href="/"> { online } | { user === 'unknown' ?  <strong id="daily-logo"> { user } 🤔 </strong> : <strong id="daily-logo"> { user } 😎 </strong> }    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />
                    <Navbar.Offcanvas
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    id="off-my-canvas"
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1">
                            { auth && !teacher && <Link href="/newMessage">
                                <a className={ styles.btnAll }> New + </a>
                            </Link>}
                            { !auth && <Link href="/login">
                                <a className={ styles.btnAll }> Login </a>
                            </Link>}
                            { !auth &&  <Link href="/signUp">
                                <a className={ styles.btnAll }> Sign Up </a>
                            </Link>}
                            { auth && !teacher &&  <Link href="/messages">
                                <a className={ styles.btnAll }> All entries </a>
                            </Link> } 
                            { auth && teacher && <Link href="/pool"> 
                                <a className={ styles.btnAll }> Pool </a>
                            </Link> }
                            { auth && <a  className={ styles.btnOut } onClick={ () => {  handleLogOut()  } } >
                                Log Out 
                            </a>}
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
        
     );
}
 
export default NavbarForApp;