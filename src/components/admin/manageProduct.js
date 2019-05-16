import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Button, Icon, Input, Label, TextArea } from 'semantic-ui-react'
import { urlAPI } from '../../supports/urlAPI'
import { connect } from 'react-redux'
import PageNotFound from '../404'
import Axios from 'axios';
import cookie from 'universal-cookie'
import swal from 'sweetalert'
import Swal2 from 'sweetalert2'
import CurrencyFormat from 'react-currency-format'


const objCookie = new cookie()

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
        event,
        Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
        <div className={classes.root}>
            <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
            >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
            >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
            >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
            >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class CustomPaginationActionsTable extends React.Component {
    state = {
        rows: [],
        page: 0,
        rowsPerPage: 5,
        isEdit: false,
        editItem: {},
        selectedFile : null,
        selectedFileEdit : null
    };

    componentDidMount(){
        var cookies = objCookie.get('userId')
        this.getDataApi(cookies)
    }

    getDataApi = (userId) => {
        Axios.get(urlAPI + '/products/productsByUserId?idAdmin=' + userId)
        .then((res) => this.setState({rows: res.data}))
        .catch((err) => console.log(err))
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    onChangeHandler = (event) => {
        this.setState({selectedFile : event.target.files[0]})
    }

    onChangeHandlerEdit = (event) => {
        this.setState({selectedFileEdit : event.target.files[0]})
    }

    valueHandler = () => {
        var value = this.state.selectedFile ? this.state.selectedFile.name : 'Pick A Picture'
        return value
    }

    valueHandlerEdit = () => {
        var value = this.state.selectedFileEdit ? this.state.selectedFileEdit.name : 'Pick A Picture'
        return value
    }

    onBtnAdd = () => {
        var product_name = this.nama.inputRef.value
        var product_price = this.harga.inputRef.value
        var product_stocks = this.stock.inputRef.value
        var product_discount = this.discount.inputRef.value ? this.discount.inputRef.value : 0
        var product_category = this.category.inputRef.value
        var product_description = this.refs.deskripsi.value
        var id_user = this.props.id
        if(product_name === '' || product_price === '' || product_price === '' || product_category === '' || this.refs.img.value === '' || product_description === ''){
            swal("Wait!", "Fill all the forms!", "error")
        } else{
            var newData = {
                product_name,
                product_price : parseInt(product_price),
                product_stocks : parseInt(product_stocks),
                product_discount : parseInt(product_discount),
                product_category : this.capitalize(product_category),
                product_description,
                id_user
            }
            var fd = new FormData()
            fd.append('product_image', this.state.selectedFile, this.state.selectedFile.name)
            fd.append('data', JSON.stringify(newData))
            Axios.post(urlAPI + '/products/addProduct', fd)
            .then((res) => {
                if(res.data.error){
                    alert(res.data.msg)
                } else{
                    swal("Add Product", res.data, "success")
                    var cookies = objCookie.get('userId')
                    this.getDataApi(cookies)
                    this.nama.inputRef.value = ''
                    this.harga.inputRef.value = ''
                    this.stock.inputRef.value = ''
                    this.discount.inputRef.value = ''
                    this.category.inputRef.value = ''
                    this.refs.deskripsi.value = ''
                }
            })
            .catch((err) => console.log(err))
        }
    }

    onBtnEditClick = (val) => {
        this.setState({isEdit : true, editItem : val})
    }

    onbtnCancel = () => {
        this.setState({isEdit : false, editItem : {}})
    }

    onBtnSave = () => {
        var product_name = this.namaEdit.inputRef.value === '' ? this.state.editItem.product_name : this.namaEdit.inputRef.value
        var product_price = this.hargaEdit.inputRef.value === '' ? this.state.editItem.product_price : this.hargaEdit.inputRef.value
        var product_stocks = this.stockEdit.inputRef.value === '' ? this.state.editItem.product_stocks : this.stockEdit.inputRef.value
        var product_discount = this.discountEdit.inputRef.value === '' ? this.state.editItem.product_discount : this.discountEdit.inputRef.value
        var product_category = this.categoryEdit.inputRef.value === '' ? this.state.editItem.product_category : this.categoryEdit.inputRef.value
        var product_description = this.refs.deskripsiEdit.value === '' ? this.state.editItem.product_description : this.refs.deskripsiEdit.value
        var id_user = this.props.id
        var newData = {
            product_name,
            product_price : parseInt(product_price),
            product_stocks : parseInt(product_stocks),
            product_discount : parseInt(product_discount),
            product_category : this.capitalize(product_category),
            product_description,
            id_user
        }
        var cookies = objCookie.get('userId')
        if(this.state.selectedFileEdit){
            var fd = new FormData()
            fd.append('product_image_edit', this.state.selectedFileEdit)
            fd.append('data', JSON.stringify(newData))
            fd.append('imageBefore', this.state.editItem.product_image)
            Axios.put(urlAPI + '/products/editProduct/' + this.state.editItem.id, fd)
            .then((res) => {
                this.getDataApi(cookies)
                this.setState({isEdit : false})
                swal('Edit Product', res.data ,'success')
                
            })
            .catch((err) => console.log(err))
        }else{
            Axios.put(urlAPI + '/products/editProduct/' + this.state.editItem.id, newData)
            .then((res) => {
                this.getDataApi(cookies)
                this.setState({isEdit : false})
                swal('Edit Product', res.data ,'success')
            })
            .catch((err) => console.log(err))
        }
    }

    onBtnDelete = (id) => {
        Axios.delete(urlAPI + '/products/deleteProduct/' + id)
        .then((res) => {
            var cookies = objCookie.get('userId')
            this.getDataApi(cookies)
            swal('Delete Product', res.data ,'success')
        })
        .catch((err) => console.log(err))
    }

    renderJsx = () => {
        var jsx = this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, index) => {
            return(
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.product_name}</TableCell>
                    <TableCell>
                        <CurrencyFormat value={val.product_price} displayType={'text'} thousandSeparator={true} prefix={'Rp.'} />
                    </TableCell>
                    <TableCell>{val.product_stocks}</TableCell>
                    <TableCell>{val.product_discount}</TableCell>
                    <TableCell>{val.product_category}</TableCell>
                    <TableCell>
                        <img src={urlAPI + '/' + val.product_image} className='pointer' onClick={() => Swal2.fire({imageUrl: urlAPI + '/' + val.product_image, imageWidth: 800, imageAlt: val.product_name, animation: false})} width='100px' alt={val.product_name}/>
                    </TableCell>
                    <TableCell>
                    <Button animated color='teal' onClick={() => swal(val.product_description)} style={{width:'100%', marginBottom: '3px'}}>
                        <Button.Content visible>Deskripsi</Button.Content>
                        <Button.Content hidden>
                            <Icon name='file alternate outline' />
                        </Button.Content>
                    </Button>
                    <Button animated color='teal' onClick={() => this.onBtnEditClick(val)} style={{width:'100%', marginBottom: '3px'}}>
                        <Button.Content visible>Edit</Button.Content>
                        <Button.Content hidden>
                            <Icon name='edit' />
                        </Button.Content>
                    </Button>
                    <Button animated color='red' onClick={() => this.onBtnDelete(val.id)} style={{width:'100%'}}>
                        <Button.Content visible>Delete</Button.Content>
                        <Button.Content hidden>
                            <Icon name='delete' />
                        </Button.Content>
                    </Button>
                    </TableCell>
                </TableRow>
            )
        })
        return jsx
    }

    render() {
        const { classes } = this.props;
        const { rows, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
        var { product_name, product_price, product_stocks, product_discount, product_category } = this.state.editItem

        if(this.props.role === 'admin'){
            return (
                <div className='container'>
                    <Paper className={classes.root}>
                        <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>NO</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>NAMA</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>HARGA</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>STOCK</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>DISC</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>CAT</TableCell>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>IMG</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderJsx()}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                            <TableRow>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                            </TableFooter>
                        </Table>
                        </div>
                    </Paper>
                    <Paper className='mt-3'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>ADD PRODUCT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Input ref={input => this.nama = input} placeholder='Nama Product' className='mt-2 ml-2 mb-2'/>
                                        <Input ref={input => this.harga = input} labelPosition='right' type='text' placeholder='Harga Product' className='mt-2 ml-2 mb-2'>
                                        <Label basic>Rp</Label>
                                            <input />
                                            <Label>.00</Label>
                                        </Input>
                                        <Input ref={input => this.stock = input} placeholder='Stock' className='mt-2 ml-2 mb-2'/>
                                        <Input ref={input => this.discount = input} placeholder='Discount' className='mt-2 ml-2 mb-2'/>
                                        <Input ref={input => this.category = input} placeholder='Category' className='mt-2 ml-2 mb-2'/>
                                        <input type='file' ref='img' placeholder='Image' style={{display: 'none'}} onChange={this.onChangeHandler}/>
                                        <input type='button' className='btn btn-success mt-2 ml-2 mb-2' onClick={() => this.refs.img.click()} value={this.valueHandler()} />
                                        <textarea rows="3" ref='deskripsi' placeholder='Deskripsi(5000)' className='form-control mt-2 ml-2 mb-2'/>
                                        <Button animated color='teal' onClick={this.onBtnAdd} style={{marginLeft: '7px'}}>
                                            <Button.Content visible>Add Product</Button.Content>
                                            <Button.Content hidden>
                                                <Icon name='add'/>
                                            </Button.Content>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Paper>
                    {
                        this.state.isEdit === true ?
                        <Paper className='mt-3'>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontSize:'20px', fontWeight: '600'}}>EDIT PRODUCT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Input ref={input => this.namaEdit = input} placeholder={product_name} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.hargaEdit = input} labelPosition='right' type='text' placeholder={product_price} className='mt-2 ml-2 mb-2'>
                                            <Label basic>Rp</Label>
                                                <input />
                                                <Label>.00</Label>
                                            </Input>
                                            <Input ref={input => this.stockEdit = input} placeholder={product_stocks} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.discountEdit = input} placeholder={product_discount} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.categoryEdit = input} placeholder={product_category} className='mt-2 ml-2 mb-2'/>
                                            <input type='file' ref='imgEdit' placeholder='Image' style={{display: 'none'}} onChange={this.onChangeHandlerEdit}/>
                                            <input type='button' className='btn btn-success mt-2 ml-2 mb-2' onClick={() => this.refs.imgEdit.click()} value={this.valueHandlerEdit()} />
                                            <textarea rows="3" ref='deskripsiEdit' placeholder='Deskripsi(5000)' className='form-control mt-2 ml-2 mb-2'/>                                            
                                            <Button animated color='teal' onClick={this.onBtnSave} style={{marginLeft: '7px'}}>
                                                <Button.Content visible>Save Changes</Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='save' />
                                                </Button.Content>
                                            </Button>
                                            <Button animated color='red' onClick={this.onbtnCancel} style={{marginLeft: '7px'}}>
                                                <Button.Content visible>Cancel</Button.Content>
                                                <Button.Content hidden>
                                                    <Icon name='cancel' />
                                                </Button.Content>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                        : null
                    }
                </div>
            );
        } else {
            return <PageNotFound/>
        }
    }
}

CustomPaginationActionsTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        id : state.user.id,
        role : state.user.role
    }
}

export default connect(mapStateToProps)(withStyles(styles)(CustomPaginationActionsTable));
