import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
	const [links, setLinks] = useState<string[]>([]);
	const linkInput = useRef<HTMLInputElement>(null);

	// Load links from local storage on initial render
	useEffect(() => {
		const storedLinks = localStorage.getItem("linkCollector-savedLinks");
		if (storedLinks) {
			setLinks(JSON.parse(storedLinks));
		}
	}, []);

	// Save links to local storage whenever the links state changes
	useEffect(() => {
		if (links.length > 0) localStorage.setItem("linkCollector-savedLinks", JSON.stringify(links));
	}, [links]);

	function addLink() {
		const newLink = linkInput.current!.value;
		if (newLink.trim() !== "") {
			setLinks([...links, newLink]);
			linkInput.current!.value = ""; // Clear input after saving
		}
	}

	return (
		<div className="wrapper">
			<h1>Link Collector </h1>
			<div className="linkCont">
				<input type="text" placeholder="Your Link" ref={linkInput} />
				<button onClick={addLink}>Save</button>
			</div>
			<div className="linkWrapperCont">
				{links.length > 0 && <h4 style={{ marginTop: 10 }}>Saved Links: </h4>}
				<div className="linkWrapper">
					{links.map((link, index) => (
						<a key={index} href={link}>
							{link}
						</a>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
