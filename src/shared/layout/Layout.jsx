import PropTypes from "prop-types";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
	return (
		<div className="layout">
			<main className="content">{children}</main>
			<Footer />
		</div>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};
