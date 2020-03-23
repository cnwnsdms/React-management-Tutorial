import React from 'react';
import { post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField'; //text type을 control
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    hidden: {
        display: 'none'
    }
})

class CustomerAdd extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file:null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'',
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        });
    }

    // handleClickOpen(){
    //     this.setState({
    //         open: true
    //     });
    // } 위에거랑 다름. 이 강의 기초에 binding 처리 확인
    
    handleClose = () => {
        this.setState({
            file:null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'',
            open: false
        })
    }


    handleFormSubmit = (e) => {
        e.preventDefault()
        this.addCustomer()
            .then((res) => {
                this.props.stateRefresh();
            })
        this.setState({
            file: null,
            userName:'',
            birthday:'',
            gender:'',
            job:'',
            fileName:'',
            open: false
        })
        // this.props.stateRefresh();
        // 고객목록데이터를 불러오는과정은 비동기적이라 항상 데이터를 추가한 이후에 목록데이터를 불러온다는것을 순서적으로 보장못함
        // 고객을 추가한 이후에 서버로부터 응답을 받고나서 비로소 고객 목록을 다시 불러오도록 .then안에 넣는다.
    }

    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            // file을 넣을때 여러개 넣을수 있지만 첫번째들어온 파일만 state의 file로 넣겠단것.
            fileName: e.target.value
        })
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name]= e.target.value;
        this.setState(nextState);
    }

    addCustomer = () =>{
        const url = 'api/customers';
        const formData = new FormData();
        formData.append('image', this.state.file);
        formData.append('name', this.state.userName);
        formData.append('birthday', this.state.birthday);
        formData.append('gender', this.state.gender);
        formData.append('job', this.state.job);
        const config = {
            headers: {
                'content-type':'multipart/form-data'
            }
        }
        return post(url, formData, config)
        // file이 포함된 data를 서버로 전송하고자 할때는 웹표준에 맞는 header를 추가해줘야된다
        // post = axios에 포함되어있는 library(해당 url에, 해당 파일을, 해당환경설정에 맞게)
        // 서버로 데이터를 보내는 과정
        // axios return값은 promise라 then사용 가능
    }
    render(){
        const { classes } = this.props;
        return(
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    고객 추가하기
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    {/* onClose가 있으면 Dilog밖을 눌렀을때 Dilog가 꺼짐 */}
                    <DialogTitle>고객 추가</DialogTitle>
                    <DialogContent>
                        <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === ""? "프로필 이미지 선택":this.state.fileName}
                            </Button>
                        </label>
                        <br/>
                        <TextField label="name" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                        <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
                        <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                        <TextField label="직업" type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
                        {/* TextField에선 label값으로 어떤값이 들어가야되는지 사용자에게 알려줌 */}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                        <Button variant="outlined " color="primary" onClick={this.handleClose}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
            // <form onSubmit={this.handleFormSubmit}>
            //     <h1>고객추가</h1>
            //     프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
            //     이름: <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
            //     생년월일: <input type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
            //     성별: <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
            //     직업: <input type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
            //     <button type="submit">추가하기</button>
            // </form>
        )
    }
}

export default withStyles(styles)(CustomerAdd);
// style이 적용된상태로 CustomerAdd를 내보냄