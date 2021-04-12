import React from 'react';
import Path from 'path';

import { Card } from 'react-bootstrap';

interface ContainerItemsProps {
  blobList: string[];
}

const AssetList: React.FC<ContainerItemsProps> = ({ blobList }: ContainerItemsProps) => {
	return (
		<div>
			<h2>Current assets</h2>
			<ul>
				{blobList.map((item) => {
					return (
						<li key={item}>
							<div>
								<Card style={{ width: '18rem' }}>
									<Card.Img variant="top" src={item} alt={item} />
									<Card.Body>
										<Card.Title></Card.Title>
										<Card.Text>
											{ Path.basename(item) }
										</Card.Text>
									</Card.Body>
								</Card>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default AssetList;