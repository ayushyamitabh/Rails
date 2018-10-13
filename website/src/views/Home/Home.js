import React, { Component } from 'react';
import {Button, Card, Icon} from 'antd';
import './Home.css';

export default class Home extends Component {
    render() {
        return(
            <div className="home">
                <h1 className="title">Rails</h1>
                <h5 className="tag-line">Keep students on track</h5>
                <Button className="home-button" href="/signup">
                    Get Started
                    <Icon type="right-circle" theme="filled" />
                </Button>
                <Card
                    title="About Rails"
                    className="about-card"
                >
                    <p>
                        “Rails” is a platform for teachers and students. 
                        Rails will help organize all events in a class. 
                        From helping set due dates and reminders to providing a discussion forum for events in a class.
                    </p>
                </Card>
            </div>
        );
    }
}
