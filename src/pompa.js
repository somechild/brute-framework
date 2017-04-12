/* todo
	* create route, route model & page dump configurators
	* create radio between data source and collections
		- create data source transformer (local or GET req for .csv & .json)
	* create data source configurator
	* create collection/data source API configurator
		- update page generateHTML to add form handlers
	* integrate Handlebars.js
		- update PageContainer 'parseTemplate' method & Page generateHTML

	* internal sanity and integrity validation checks
	* api sanity checks + configurator
	* unified error handling

	* make a boilerplate that runs off a config file - so users do not have to write any js
		* general config file
		* route model-to-data source config file
	* create ssh script that initializes empty project

	* documentation readme
	* documentation npmjs
	* documentation website

	* feedback and iterations!

	* i hope modules use topological sorts lol cause i have interdependent shit rip
*/

let MainClasses = require('./Woven.js');