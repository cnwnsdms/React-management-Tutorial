import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class CustomerDelete extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            open:false
        }
    }
    handleClickOpen = () => {
        this.setState({
            open: true
        });
    }
    
    handleClose = () => {
        this.setState({
            open: false
        })
    }

    deleteCustomer(id){
        const url = '/api/customers/' + id;
        //일반적으로 REST API에서는 고객데이터를 특정한 아이디로 삭제하고자할때 이런식으로
        //경로에 접근해서 삭제함. ex) /api/customers/7
        fetch(url, {
            method: 'DELETE'
        });
        // DELETE 라는 method로 접근했을때 삭제가 이루어지도록 하는게 가장 합리적
        this.props.stateRefresh();
    }
    
    render(){
        return(
            <div>
                <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>삭제</Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    {/* Dialog에 prop으로 언제 open해야하는지 필요함. debbuging으로 알아냄*/}
                    <DialogTitle onClose={this.handleClose}>
                        삭제 경고
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            선택한 고객 정보가 삭제됩니다.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e)=>{this.deleteCustomer(this.props.id)}}>삭제</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CustomerDelete