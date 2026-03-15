import elementsData from "./dependencies/elements.json"
import SelectEngine from "../select/SelectEngine";
import "./dependencies/style/elements.css"

const defaultElement = {type: "!", placeholder: ["!"], id: "!",   className: "!", amount: 1 };
const supportedTypes = ["text", "select", "email", "password", "search", "url", "tel"]
const componentsMap = {"SelectEngine": SelectEngine};
function Modal({title, type, elements, animation, Id, Class})
{

  const fields = SerializeData(title, type, elements, animation, Id, Class); 

  if(fields === null)
  {
    return null;
  }

  //console.log(fields);
  //console.log(elementsData);
  return (
    <>
      <div className={Class} id={Id}>
        <h3 id="modal-header">{title}</h3>
    
        {fields.map((field, i) => {
          const elementDef = elementsData.find(e => e.element === field.type) || elementsData.find(e => e["inherited-element"]?.includes(field.type));
          const Tag = elementDef.is_custom? componentsMap[elementDef.tag] : elementDef.tag;

          return(
            <div className="grouped-elements" key={`1${i}`} >
              {Array.from({ length: field.amount }, (_, j) => {
                  const Tagprobs = {
                    className: elementDef["default-class"],
                    role: elementDef.aria.role,
                    ...(elementDef["supports-placeholder"] && ({placeholder: Array.isArray(field.placeholder) ? field.placeholder[j] : field.placeholder })),
                    ...(elementDef["tag-type"] && ({ type: elementDef["tag-type"] }))
                  }
                  return <Tag key={j} {...Tagprobs}/>
              })
              }
              
            </div>
          )
        })}
        <button className="modal-btn">Submit</button>
      </div>
    </>
  )
}
function SerializeData(title, type, elements, animation, Id, Class)
{
  const validator = ValidateInput(title, type, elements, animation, Id, Class)

    if(validator.status !== 1)
    {
      console.error(validator.error)
      return null
    }

    const normalizedElements = elements.map(ele => ({...defaultElement, ...ele}));
    const eleValidator =  validateElements(normalizedElements);

    if(eleValidator.status !== 1)
    {
      console.error(eleValidator.error)
      return null
    }

    return normalizedElements; 
}
function ValidateInput(title, type, elements = [], animation, Id, Class)
{
  if(!title)
  {
    return {status: -1, error: "Please provide a title"};
  }  
  if (!Array.isArray(elements) || !elements.every(ele => typeof ele === 'object'))
  {
    return {status: -1, error: "Element should be provided as an array of objects."};
  }
  if(animation && typeof animation === 'string')
  {
    // todo when you figure out animations configue you need to write a great validation here
  }

  return  {status: 1};
}
function validateElements(elements)
{      

  for(const element of elements)
  {
    if(!supportedTypes.includes(element.type))
    {       
      return {status: -1, error: "Elements should include a valid type."};
    }
    if(element.amount < 1 || element.amount > 3)
    {
      return {status: -1, error: "Element amount should be positive and less than 3."};
    }
    else if (element.amount > 1)
    {
      if (!Array.isArray(element.placeholder) || element.placeholder.length !== element.amount)
      {
        return {status: -1, error: "Element placeholder should be provided as an array of the same length as the provided amount."};
      }
    }
    else
    {
      if(typeof element.placeholder !== "string")
      {
        return {status: -1, error: "Element placeholder should be provided as string when the amount is set to 1."};
      }
    }
  };

  return  {status: 1};
}

export default Modal;
/*
{
  title: "Create Post",
  animation: "bubble", // or "slide", "fade", "scale", "flip"
  fields: [
    { 
      type: "text", 
      name: "caption", 
      placeholder: "What's on your mind?",
      className: "caption-input",
      id: "post-caption"
    },
    { 
      type: "file", 
      name: "image",
      className: "file-upload",
      id: "post-image",
      holder: "upload-zone" // custom wrapper class?
    },
  ],
  onSubmit: (data) => createPost(data)
}
  prototype
*/