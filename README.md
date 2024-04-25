# airplane-tracker

This project, undertaken as part of the Advanced Database research project at SRH Heidelberg University, focuses on airplane tracking and data analysis under the guidance of Professor Frank Hefter.

## Database Setup

Go to the project's root folder, rename `.env.sample` to `.env`, fill out your database credentials.
Then, run `docker compose up -d` and wait for all databases to start.

## Credits

### OpenSky Network

The project utilizes data from the OpenSky Network dataset to analyze flight patterns and air traffic. We extend our appreciation to the OpenSky Network for providing access to their valuable dataset.

We acknowledge the contributions of the OpenSky Network and cite their original paper:

Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic, and Matthias Wilhelm.
"Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research."
In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.

For more information about the OpenSky Network and access to their dataset, please visit [their website](https://opensky-network.org).
