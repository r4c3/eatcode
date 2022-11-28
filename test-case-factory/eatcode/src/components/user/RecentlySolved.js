import { Component, useState, useEffect } from 'react';
import Problem from '../problems/Problem';
import { Scrollbars } from 'react-custom-scrollbars';

export default class RecentlySolved extends Component {
    constructor(props) {
        super(props)
        // this.attemptedProblems = Array.from(props.user.attemptedProblems.values())
    }

    render() {
    const styles = {
        container: {
            display: "inline-box",
            position: "absolute",
            marginTop: "220px",
            marginLeft: "340px",
        },
        grid: {
            width: '80vw',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90em',
            overflowY: "scroll"
        },
        scroll: {
            width: 1170,
            height: 465,
        }
    }

    return (
        <div style={styles.container}>
            <h3>Recently Solved Problems</h3>            
            <div style={styles.grid}>
                <Scrollbars style={styles.scroll}>
                    {this.attemptedProblems.map((problem) => {
                        return (<>
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                                <Problem key={problem.id} problem={problem} />
                            </>
                        );
                    })}
                </Scrollbars>
            </div>
        </div>
    )
    }
}