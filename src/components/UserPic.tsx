const classStr = "absolute top-0 right-0 h-3 w-3 my-0 border-2 border-white rounded-full z-2";

const UserPic = (
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => (
  <div className=
    {props.checked && !props.disabled ? classStr+" bg-green-400" : props.checked && props.disabled ? classStr+" bg-red-400" : classStr+" bg-gray-300"}>
  </div>
);

export default UserPic;