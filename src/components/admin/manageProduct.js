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
import { Button, Icon, Input, Label } from 'semantic-ui-react'
import { urlAPI } from '../../supports/urlAPI'
import { connect } from 'react-redux'
import PageNotFound from '../404'
import Axios from 'axios';
import swal from 'sweetalert'


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
        editItem: {}
    };

    componentDidMount(){
        this.getDataApi()
    }

    getDataApi = () => {
        Axios.get(urlAPI + '/products?idAdmin=' + this.props.id)
        .then((res) => {console.log(res); this.setState({rows: res.data})})
        .catch((err) => console.log(err))
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    };

    onBtnAdd = () => {
        var nama = this.nama.inputRef.value
        var harga = this.harga.inputRef.value
        var stock = this.stock.inputRef.value
        var discount = this.discount.inputRef.value
        var category = this.category.inputRef.value
        var img = this.img.inputRef.value
        var deskripsi = this.deskripsi.inputRef.value
        var idAdmin = this.props.id
        if(nama === '' || harga === '' || stock === '' || discount === '' || category === '' || img === '' || deskripsi === ''){
            swal("Wait!", "Fill all the forms!", "error")
        } else{
            var newData = {nama, harga : parseInt(harga), stock : parseInt(stock), discount : parseInt(discount), category, img, deskripsi, idAdmin}
            Axios.post(urlAPI + '/products', newData)
            .then((res) => {
                swal("Add Product", "Add Product Success", "success")
                this.getDataApi()
                this.nama.inputRef.value = ''
                this.harga.inputRef.value = ''
                this.stock.inputRef.value = ''
                this.discount.inputRef.value = ''
                this.category.inputRef.value = ''
                this.img.inputRef.value = ''
                this.deskripsi.inputRef.value = ''
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
        var nama = this.namaEdit.inputRef.value === '' ? this.state.editItem.nama : this.namaEdit.inputRef.value
        var harga = this.hargaEdit.inputRef.value === '' ? this.state.editItem.harga : this.hargaEdit.inputRef.value
        var stock = this.stockEdit.inputRef.value === '' ? this.state.editItem.stock : this.stockEdit.inputRef.value
        var discount = this.discountEdit.inputRef.value === '' ? this.state.editItem.discount : this.discountEdit.inputRef.value
        var category = this.categoryEdit.inputRef.value === '' ? this.state.editItem.category : this.categoryEdit.inputRef.value
        var img = this.imgEdit.inputRef.value === '' ? this.state.editItem.img : this.imgEdit.inputRef.value
        var deskripsi = this.deskripsiEdit.inputRef.value === '' ? this.state.editItem.deskripsi : this.deskripsiEdit.inputRef.value
        var idAdmin = this.props.id
        var newData = {nama, harga : parseInt(harga), stock : parseInt(stock), discount : parseInt(discount), category, img, deskripsi, idAdmin}
        Axios.put(urlAPI + '/products/' + this.state.editItem.id, newData)
        .then((res) => {
            this.getDataApi()
            swal('Edit Product Success', '' ,'success')
            this.setState({isEdit : false, editItem : {}})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onBtnDelete = (id) => {
        Axios.delete(urlAPI + '/products/' + id)
        .then((res) => {
            this.getDataApi()
        })
        .catch((err) => console.log(err))
    }

    renderJsx = () => {
        var jsx = this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((val, index) => {
            return(
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.nama}</TableCell>
                    <TableCell>{val.harga}</TableCell>
                    <TableCell>{val.stock}</TableCell>
                    <TableCell>{val.discount}</TableCell>
                    <TableCell>{val.category}</TableCell>
                    <TableCell><img src={val.img} width='100px' alt={val.nama}/></TableCell>
                    <TableCell>
                    <Button animated color='teal' onClick={() => this.onBtnEditClick(val)} style={{width:'100%'}}>
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
        var { nama, harga, stock, discount, category, img, deskripsi } = this.state.editItem

        if(this.props.role === 'admin'){
            return (
                <div className='container'>
                    <Paper className={classes.root}>
                        <div className={classes.tableWrapper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontSize:'20px', fontWeight: '600'}}>ID</TableCell>
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
                                        <Input ref={input => this.img = input} placeholder='Image' className='mt-2 ml-2 mb-2'/>
                                        <Input ref={input => this.deskripsi = input} placeholder='Deskripsi' className='mt-2 ml-2 mb-2'/>
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
                                            <Input ref={input => this.namaEdit = input} placeholder={nama} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.hargaEdit = input} labelPosition='right' type='text' placeholder={harga} className='mt-2 ml-2 mb-2'>
                                            <Label basic>Rp</Label>
                                                <input />
                                                <Label>.00</Label>
                                            </Input>
                                            <Input ref={input => this.stockEdit = input} placeholder={stock} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.discountEdit = input} placeholder={discount} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.categoryEdit = input} placeholder={category} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.imgEdit = input} placeholder={img} className='mt-2 ml-2 mb-2'/>
                                            <Input ref={input => this.deskripsiEdit = input} placeholder={deskripsi} className='mt-2 ml-2 mb-2'/>
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
