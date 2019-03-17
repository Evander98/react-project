import React from 'react';
import cookie from 'universal-cookie'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { resetUser } from '../1.actions'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

const objCookie = new cookie()

class HeaderKu extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
        isOpen: false
        };
    }
    toggle() {
        this.setState({
        isOpen: !this.state.isOpen
        });
    }

    onBtnLogout = () => {
        objCookie.remove('userData')
        this.props.resetUser()
    }
    render() {
        return (
            <div style={{marginBottom:"75px"}}>
                <Navbar color="light" light expand="md" fixed="top">
                    <NavbarBrand className="ml-2" ><Link to='/' style={{color:'black', textDecoration:'none'}}>Rednave</Link> </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        {
                            this.props.username !== '' ?
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink>Hi, {this.props.username}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <Link to="/"><NavLink className="btn btn-default" style={{fontSize:"14px"}}><i class="fas fa-shopping-cart"></i> Cart</NavLink></Link>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Menu
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                    {
                                        this.props.role === 'admin' ?
                                        <Link to='/manage-product'>
                                            <DropdownItem>
                                                Manage Product
                                            </DropdownItem>
                                        </Link>
                                        : null
                                    }
                                    <DropdownItem>
                                        History Transaksi
                                    </DropdownItem>
                                    <DropdownItem>
                                        Edit Profile
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <Link to='/'>
                                        <DropdownItem onClick={this.onBtnLogout}>
                                            Logout
                                        </DropdownItem>
                                    </Link>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                            :
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Link to="/register"><NavLink className="btn btn-default border-secondary mr-1" style={{fontSize:"14px"}}><i className="fas fa-user-plus" /> Daftar</NavLink></Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/login"><NavLink className="btn btn-default border-secondary" style={{fontSize:"14px"}}><i className="fas fa-sign-in-alt" /> Masuk</NavLink></Link>
                                </NavItem>
                            </Nav>
                        }
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username : state.user.username,
        role : state.user.role
    }
}

export default connect(mapStateToProps, { resetUser })(HeaderKu)