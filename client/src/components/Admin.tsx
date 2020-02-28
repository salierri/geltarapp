import React from 'react';

class Admin extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <span className="uk-padding">Master volume</span>
                    <input type="range" className="uk-range master-slider uk-align-center" min="0" max="300" defaultValue="100" />
                </div>
                <div>
                    <span className="uk-padding">Seek ahead</span>
                    <input type="range" className="uk-range master-slider uk-align-center" min="0" max="100" defaultValue="0" />
                </div>
                <div className="uk-inline">
                    <button className="master-button uk-button">Play</button>
                    <button className="master-button uk-button">Pause</button>
                </div>
            </div>
        );
    }
}

export default Admin;