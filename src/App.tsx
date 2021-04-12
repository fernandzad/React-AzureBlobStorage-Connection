import React from 'react';

import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Upload } from './components/Upload';
import { MetadataForm } from './components/MetadataForm';

const App: React.FC = () => {

	return (
		<>
			<Container className="pt-5">
				<Row>
					<Col>
					<Tabs defaultActiveKey="upload" id="tab-assets">
						<Tab eventKey="upload" title="Upload">
							<Upload />
						</Tab>
						<Tab eventKey="metadata" title="Metadata">
							<MetadataForm/>
						</Tab>
					</Tabs>
					</Col>
				</Row>
			</Container>
		</>
	);

};

export default App;
