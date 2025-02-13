import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const VisibilityFilter = (props)=>{
    const dispatch = useDispatch();

    return (
        <div>
            <div>
                all <input type="radio" name="filter" onChange={() => dispatch(filterChange("ALL"))}></input>
                important <input type="radio" name="filter" onChange={() => dispatch(filterChange("IMPORTANT"))}></input>
                nonimportant <input type="radio" name="filter" onChange={() => dispatch(filterChange("NONIMPORTANT"))}></input>
            </div>
        </div>
    )
};

export default VisibilityFilter;