import { MouseEvent, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
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

	async function addLink() {
		const newLink = linkInput.current!.value.trim();

		if (newLink === "") {
			return; // Do nothing if the input is empty
		}

		// Check if the link already exists in the links array
		if (links.includes(newLink) || links.includes(`https://${newLink}`)) {
			// Handle duplicate link case here, such as showing an error message
			alert("Duplicate link. Please enter a unique link.");
			linkInput.current!.value = "";
			return;
		}

		// Add "https://" if missing and the link doesn't start with "http"
		const formattedLink = !newLink.startsWith("http") ? `https://${newLink}` : newLink;

		// Fetch favicon URL
		try {
			setLinks([...links, formattedLink]);
			linkInput.current!.value = ""; // Clear input after saving
		} catch (error) {
			console.error("Error fetching link preview:", error);
		}

		setLinks([...links, formattedLink]);
		linkInput.current!.value = ""; // Clear input after saving
	}

	function deleteAllLinks() {
		setLinks([]);
		localStorage.removeItem("linkCollector-savedLinks");
	}

	function getCleanLink(link: string) {
		return link.replace(/^https?:\/\//i, ""); // Remove "http://" or "https://"
	}

	function getFaviconUrl(domain: string) {
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${256}`;
	}

	function deleteItem(event: MouseEvent<HTMLButtonElement>, link: string): void {
		event.preventDefault();
		const newLinks = links.filter((item) => item !== link);
		setLinks(newLinks);
		localStorage.setItem("linkCollector-savedLinks", JSON.stringify(newLinks));
	}

	return (
		<div className="wrapper">
			<h1>Link Collector </h1>
			<div className="linkCont">
				<input
					type="text"
					placeholder="Your Link"
					ref={linkInput}
					onKeyDown={(event) => {
						if (event.key === "Enter") addLink();
					}}
				/>
				<button onClick={addLink}>Save</button>
			</div>
			<div className="linkWrapperCont">
				{links.length > 0 && (
					<>
						<div className="collectionHeader">
							<h4 style={{ margin: 0 }}>Saved links: </h4>
							<button onClick={deleteAllLinks} className="iconButton">
								<DeleteIcon />
								<p>Delete all links</p>
							</button>
						</div>

						<div className="linkWrapper">
							{links.map((link, index) => (
								<a key={index} className="linkBox" href={link}>
									<button onClick={(e) => deleteItem(e, link)} className="deleteItem">
										<CloseIcon />
									</button>
									<img src={getFaviconUrl(link)} alt="Favicon" className="favicon" />
									<p>{getCleanLink(link)}</p>
								</a>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default App;
