using System.ComponentModel.DataAnnotations;

namespace Monty_Hall_API.Models.Domain
{
    public class MontyHall{
        [Key]
        public Guid InstanceId { get; set; }
        public int PrizeDoor { get; set; }
        public int Tmp { get; set; }
        public int DoorToReveal { get; set; }
        public int SelectedDoor { get; set; }
        public int OpenDoor { get; set; }

        public MontyHall() {
            InstanceId = Guid.NewGuid();

            Random rnd = new();
            PrizeDoor = rnd.Next(1,4);
        }

        public bool SelectDoor(int id){
            if (0 < id && id < 4)
            {
                SelectedDoor = id;
                return true;
            }
            else
            {
                return false;
            }
        }

        private int SelectNonPrizeDoor()
        {
            Random rnd = new();
            Tmp = rnd.Next(1,4);
            if (Tmp == PrizeDoor || Tmp == SelectedDoor)
            {
                return SelectNonPrizeDoor();
            }
            else
            {
                return Tmp;
            }
        }

        public int RevealDoor()
        {
            DoorToReveal = SelectNonPrizeDoor();
            OpenDoor = DoorToReveal;
            return DoorToReveal;
        }

        public string FinalSelect(int id)
        {
            if (OpenDoor == id)
            {
                return "Door Already Opened";
            }
            else
            {
                if (id == PrizeDoor)
                {
                    return "Congratulations!!! You won the CAR :)";
                }
                else
                {
                    return "Baaaa! Baaaa, Oops looks like you have a GOAT!";
                }
            }
        }
    }
}
