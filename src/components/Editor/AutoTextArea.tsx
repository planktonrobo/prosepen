import React, {
	useState,
	useEffect,
	useRef,
	TextareaHTMLAttributes,
} from "react";
import { useDebounce } from "use-debounce";
import { updateDraftTitle } from "../../services/writing";

interface ParentCompProps {
	docId? : React.ReactNode
}


const AutoTextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>,{docId}:ParentCompProps ) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [text, setText] = useState("");
	const [textAreaHeight, setTextAreaHeight] = useState("auto");
	const [parentHeight, setParentHeight] = useState("auto");
	const [dimensions, setDimensions] = useState({ 
		height: window.innerHeight,
		width: window.innerWidth
	  })

	useEffect(() => {
		function handleResize() {
			setDimensions({
			  height: window.innerHeight,
			  width: window.innerWidth
			})
			setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
			setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`)
		}
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
		setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);

	}, [text]);

	

	const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextAreaHeight("auto");
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
		setText(event.target.value);

		if (props.onChange) {
			props.onChange(event);
		}
	};

	const [value] = useDebounce(text, 800)

	useEffect(() => {
		console.log(value)
		console.log(docId)
	}, [value])

	return (
		<div
		
			style={{
				minHeight: parentHeight,
				
			}}
		>
			<textarea
				{...props}
				className="an"
				ref={textAreaRef}
				maxLength={100}
				rows={1}
				placeholder="Title"
				style={{
					height: textAreaHeight,
					
			
				}}
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default AutoTextArea;