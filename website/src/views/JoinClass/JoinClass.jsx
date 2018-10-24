import React, {Component} from 'react';
import { Form, Input, Button, Card, Select} from 'antd';
import './JoinClass.css';

const FormItem = Form.Item;

class JoinClass extends Component
{
    constructor(props) {
        super(props);
        this.state={
            university: null,
            classSelection: null,
            studentID: null,
            email: null
        }
        this.getColleges = this.getColleges.bind(this);
    }

    getColleges(collegeName) {
        const prefix = "https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=";
        const name = encodeURI(collegeName);
        const suffix = "&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK";
        fetch(prefix+name+suffix)
        .then(res => res.json())
        .then((result) => {
            const schools = result.data.results;
            let schoolOptions = [];
            schools.forEach(element => {
                schoolOptions.push(element['school.name'])
            });
            this.setState({
                collegeOptions: schoolOptions
            });
        })
        .catch(e=> {
            console.log(e);
        })
    }

    getSchoolOptions() {
        let schools = this.state.collegeOptions;
        //let schoolsObj = []
        return schools.map(v => {
            return (
                <Select.Option key={v}>
                    {v}
                </Select.Option>)
        })
    }
    
    render() {
        
        const formItemLayout = {
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
          },
        };
    
        return (
            
            <div className="join">
                <h1 className="title">Rails</h1>
                <Card
                    className="joinclasscard"
                    title="Join Class"
                    extra={<a href="#"></a>}
                    >
                    <Form className="regiform">
                        <FormItem
                            {...formItemLayout}>
                            <Select
                                size="default"
                                showSearch
                                onSearch={this.getColleges}
                                placeholder="University/College"
                                style={{width:'100%'}}
                                onChange={(e)=> this.setState({universities: e})}>
                                {this.state.collegeOptions && this.getSchoolOptions()}
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}>
                            <Select 
                                placeholder="Class and Section code"
                                mode="multiple" />
                        </FormItem>
                        <div className="registerButton">
                            <Button margin="auto" type="primary" htmlType="submit">Join</Button>
                        </div>
                    </Form>
                </Card>
                <br/>
                <Card
                    className="request_permission"
                    title="Request Permission"
                    extra={<a href="#"></a>}
                    >
                    <Form className="permission_form">
                        <FormItem
                            {...formItemLayout}>
                            <Select 
                                placeholder="Class and Section code"
                                mode="multiple" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}>
                            <Input placeholder="Student ID #"/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}>
                            <Input placeholder="College Email"/>
                        </FormItem>
                        <div className="registerButton">
                            <Button margin="auto" type="primary" htmlType="submit">Request</Button>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default JoinClass;
