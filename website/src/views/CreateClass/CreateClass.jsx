import React, { Component } from 'react';
import {
  Form, Input, Tooltip, Icon, Button, Card, DatePicker, TimePicker, Checkbox, Select,
} from 'antd';
import './CreateClass.css';
import { WithProtectedView } from '../../hoc';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const format = 'HH:mm';

class CreateClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universities: null,
      classname: null,
      sectioncode: null,
      meetingDates: null,
      days: null,
      times: null,
      collegeOptions: null,
    };
    this.getColleges = this.getColleges.bind(this);
  }

  getColleges(collegeName) {
    const prefix = 'https://api.data.gov/ed/collegescorecard/v1/schools/?fields=school.name&per_page=20&school.name=';
    const name = encodeURI(collegeName);
    const suffix = '&school.operating=1&latest.student.size__range=1..&latest.academics.program_available.assoc_or_bachelors=true&school.degrees_awarded.predominant__range=1..3&school.degrees_awarded.highest__range=2..4&api_key=EvH8zAC2Qq6JywcjnHmNHwBnzGkOwSsVHsjXf2bK';
    fetch(prefix + name + suffix)
      .then(res => res.json())
      .then((result) => {
        const schools = result.results;
        const schoolOptions = [];
        schools.forEach((element) => {
          schoolOptions.push(element['school.name']);
        });
        this.setState({
          collegeOptions: schoolOptions,
        });
      });
  }

  getSchoolOptions() {
    const schools = this.state.collegeOptions;
    // let schoolsObj = []
    return schools.map(v => (
      <Select.Option key={v}>
        {v}
      </Select.Option>));
  }

  render() {
    function DatesOnChange(date, dateString) {
      console.log(date, dateString);
    }

    function TimeOnChange(time, timeString) {
      console.log(time, timeString);
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (

      <div className="create">
        <h1 className="title">Rails</h1>
        <Card
          className="createcard"
          title="Create Class"
          extra={<a href="/join/class">Already have a class code? Join Class</a>}
        >
          <Form className="regiform">
            <FormItem
              {...formItemLayout}
            >
              <Select
                showSearch
                size="default"
                onSearch={this.getColleges}
                prefix={<Icon type="bank" />}
                placeholder="University/College"
                style={{ width: '100%' }}
                onChange={e => this.setState({ universities: e })}
              >
                {this.state.collegeOptions && this.getSchoolOptions()}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Input placeholder="Class Name" />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Input placeholder="Section code" />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <span>
                                Meeting Dates&nbsp;
              </span>
              <RangePicker onChange={DatesOnChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <span>
                                Days & Times&nbsp;
              </span>
              <CheckboxGroup options={plainOptions} />
              <TimePicker format={format} onChange={TimeOnChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Tooltip title="please make sure you're using the pre-approved E-mail address">
                <Icon type="question-circle-o" />
              </Tooltip>
              <Input placeholder="Email" />
            </FormItem>
            <div className="registerButton" align="center">
              <Button margin="auto" type="primary" htmlType="submit">Create</Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}

const ProtectedCreateClass = WithProtectedView(CreateClass);
export { CreateClass, ProtectedCreateClass };
