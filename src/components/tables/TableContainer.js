import React, { Component } from "react";
import CircularProgress from "material-ui/CircularProgress";
import { connect } from "react-redux";
// import marked from "marked";
// import prism from "../utils/prism";

const mapStateToProps = state => ({
	theme: state.config.theme,
	isLoading: state.results.isLoading
});

class TableContainer extends Component {
	render() {
		const {
			title,
			subtitle,
			theme,
			isLoading,
			data,
			emptyStateMessage
		} = this.props;

		const headerStyle = {
			color: theme.gray,
			fontWeight: "medium",
			display: "block",
			width: "50%",
			textOverflow: "ellipsis",
			overflow: "hidden"
		};

		const header = (
			<h1 style={headerStyle}>
				{title}
			</h1>
		);
		const subheader = subtitle
			? <h4 style={{ color: theme.lightGray }}>
					{subtitle}
				</h4>
			: null;

		const titleSection = (
			<div>
				{header}
				{subheader}
			</div>
		);

		const emptyStyle = {
			display: "flex",
			width: "100%",
			paddingTop: "100px",
			justifyContent: "center",
			alignItems: "center",
			color: theme.lightGray
		};

		const emptyState = (
			<h1 style={emptyStyle}>
				{emptyStateMessage}
			</h1>
		);

		const loader = (
			<CircularProgress
				style={emptyStyle}
				size={80}
				thickness={6}
				color={theme.blue}
			/>
		);

		if (data.length === 0) {
			if (isLoading === true) {
				return loader;
			}
			return emptyState;
		}

		return (
			<div>
				{titleSection}
				{this.props.children}
			</div>
		);
	}
}

export default connect(mapStateToProps)(TableContainer);

// TODO: Show the actual code with marked
// var markdownString = '```js\n console.log("hello"); \n```';

// const renderer = new marked.Renderer();

// renderer.heading = (text, level) => {
// 	const escapedText = text
// 		.toLowerCase()
// 		.replace(/=&gt;|&lt;| \/&gt;|<code>|<\/code>/g, "")
// 		.replace(/[^\w]+/g, "-");

// 	return (
// 		`
//   <h${level}>
//     <a class="anchor-link" id="${escapedText}"></a>${text}` +
// 		`<a class="anchor-link-style" href="#${escapedText}">${"#"}</a>
//   </h${level}>
// `
// 	);
// };

// marked.setOptions({
// 	gfm: true,
// 	tables: true,
// 	breaks: false,
// 	pedantic: false,
// 	sanitize: false,
// 	smartLists: true,
// 	smartypants: false,
// 	// $FlowFixMe
// 	highlight(code) {
// 		return prism.highlight(code, prism.languages.js);
// 	},
// 	renderer
// });

// 		return (
// 	<span
// 		dangerouslySetInnerHTML={{ __html: marked(markdownString) }}
// 	/>
// );